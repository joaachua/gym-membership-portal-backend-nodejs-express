const knex = require("../../../config/db");
const { exec, spawn } = require("child_process");

const path = require("path");
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
	recommendWorkout: async (userInput) => {
		const { age, goal, fitness_level, hours_per_week, has_equipment } =
			userInput;
		let workoutPlan = [];

		if (fitness_level === 0) {
			workoutPlan.push("Bodyweight exercises (Push-ups, Squats, Planks)");
			if (goal === 1) workoutPlan.push("Focus on bodyweight exercises"); // Muscle gain
			if (goal === 2)
				workoutPlan.push("Try more reps and increase workout time gradually"); // Endurance
		} else if (fitness_level === 1) {
			workoutPlan.push("Weight training (Dumbbells, Barbell)");
			if (goal === 1) workoutPlan.push("Increase sets and weights gradually");
			if (goal === 2)
				workoutPlan.push("Focus on circuit training with moderate weight");
		} else if (fitness_level === 2) {
			workoutPlan.push(
				"Advanced weight training (Deadlifts, Squats, Bench Press)"
			);
			if (goal === 1) workoutPlan.push("Heavy lifting with low reps");
			if (goal === 2)
				workoutPlan.push("High-intensity interval training (HIIT)");
		}

		if (hours_per_week >= 5) {
			workoutPlan.push(
				"You can increase your workout frequency to 5 days a week"
			);
		} else if (hours_per_week >= 3) {
			workoutPlan.push("Try to aim for 3-4 workout sessions per week");
		}

		if (!has_equipment) {
			workoutPlan.push("No equipment? Focus on bodyweight exercises");
		} else {
			workoutPlan.push(
				"With equipment, you can try more weight training exercises"
			);
		}

		return workoutPlan;
	},

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

	generateWorkout: async (goal, level, equipment) => {
		return new Promise((resolve, reject) => {
			const input = JSON.stringify({ goal, level, equipment });
			const pythonScript = path.join(
				__dirname,
				"../../models/python/generate_workout.py"
			);

			exec(`python3 ${pythonScript} '${input}'`, (err, stdout, stderr) => {
				if (err) {
					console.error("Python error:", stderr);
					return reject("Error executing Python script");
				}

				try {
					const result = JSON.parse(stdout);
					if (result.error) return reject(result.error);
					resolve(result);
				} catch (e) {
					reject("Invalid JSON output from Python");
				}
			});
		});
	},
};

module.exports = Workout;
