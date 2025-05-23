const knex = require("../../../config/db");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const path = require("path");
const moment = require("moment-timezone");

const MET_VALUES = {
	"push-ups": 8,
	squats: 5,
	planks: 3,
	"jumping jacks": 8,
	running: 11.5,
	cycling: 8,
	walking: 3.8,
	"weight training": 6,
	hiit: 9,
};

const Workout = {
	calculateCaloriesBurned: async (exercise, duration, weightKg) => {
		const met = MET_VALUES[exercise.toLowerCase()];
		if (!met) {
			throw new Error("Unknown exercise type");
		}

		// Formula: Calories = METs × weight in kg × duration in hours
		const calories = met * weightKg * (duration / 60);
		return parseFloat(calories.toFixed(2));
	},

	createLog: async (data) => {
		const { user_id, exercise, duration, weight_kg, date, calories_burned } =
			data;

		const insertData = {
			user_id,
			exercise,
			duration,
			weight_kg,
			date,
			calories_burned,
		};

		const [id] = await knex("user_workouts").insert(insertData);

		if (!id) throw new Error("Failed to create workout log");

		return { id, ...insertData };
	},

	editLog: async (id, data) => {
        if (!id) throw new Error("Invalid log ID");

		const { exercise, duration, weight_kg, date, calories_burned } = data;

		const trx = await knex.transaction();

		try {
			const updateData = {};
            if (exercise) updateData.exercise = exercise;
            if (duration) updateData.duration = duration;
            if (weight_kg) updateData.weight_kg = weight_kg;
            if (date) updateData.date = date;
            if (calories_burned) updateData.calories_burned = calories_burned;
	
			await trx("user_workouts").where({ id }).update(updateData);
	
			await trx.commit();
            return true;
		} catch (error) {
            await trx.rollback();
            throw error;
		}
	},

	viewLog: async (id) => {
        if (!id) throw new Error("Invalid log ID");

		try {
            const details = await knex("user_workouts").where({ id }).first();
            if (!details) return null;

			return details;
		} catch (error) {
            throw error;
		}
	},

	deleteLog: async (id) => {
		const trx = await knex.transaction();
        if (!id) throw new Error("Invalid log ID");

		try {
            const deleted = await trx("user_workouts").where({ id }).del();
    
            await trx.commit();
            return deleted > 0;
		} catch (error) {
            await trx.rollback();
            throw error;
		}
	},

	logList: async (user_id) => {
		try {
            const list = await knex("user_workouts")
			.where({ user_id })
			.orderBy("date", "desc"); // or 'created_at'

			if (!list || list.length === 0) return [];

			// Adjust all dates to +8 (Malaysia Time)
			const adjustedList = list.map((item) => ({
				...item,
				date: moment(item.date).tz("Asia/Kuala_Lumpur").format(), // ISO with +08:00
			}));

			return adjustedList;
		} catch (error) {
            throw error;
		}
	},

	generateWorkout: async (muscle_group, equipment, rating) => {
		try {
			const input = JSON.stringify({ muscle_group, equipment, rating });
			const pythonScript = path.join(__dirname, "../python/generate_workout.py");
			const { spawn } = require("child_process");
	
			const pyProcess = spawn("python3", [pythonScript]);
	
			return await new Promise((resolve, reject) => {
				let result = "";
				let errorOutput = "";
	
				pyProcess.stdout.on("data", (data) => {
					result += data.toString();
				});
	
				pyProcess.stderr.on("data", (data) => {
					errorOutput += data.toString(); // Log only; don't auto-reject
				});
	
				pyProcess.on("close", (code) => {
					try {
						// Grab last non-empty line from stdout
						const lines = result.trim().split("\n").filter(line => line.trim() !== "");
						const jsonOutput = JSON.parse(lines[lines.length - 1]);
	
						if (jsonOutput.error) {
							return reject(new Error(jsonOutput.error));
						}
	
						return resolve(jsonOutput);
					} catch (e) {
						// If parsing fails, then check if stderr has anything useful
						console.error("Python stderr:", errorOutput);
						console.error("Raw stdout:", result);
						return reject(new Error("Failed to parse Python output: " + e.message));
					}
				});
	
				// Send JSON input to Python
				pyProcess.stdin.write(input);
				pyProcess.stdin.end();
			});
		} catch (e) {
			console.error("Execution failed:", e.message);
			throw new Error("Workout generation failed");
		}
	}	
};

module.exports = Workout;
