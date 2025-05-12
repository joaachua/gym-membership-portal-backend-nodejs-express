const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse,
} = require("../../../services/helper");

const Workout = require("../../models/User/Workout");

/**
 * @swagger
 * /user/recommend-workout:
 *   post:
 *     summary: Recommend a workout based on user input
 *     tags: [Workout]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - age
 *               - goal
 *               - fitness_level
 *               - hours_per_week
 *               - has_equipment
 *             properties:
 *               age:
 *                 type: integer
 *                 example: 25
 *               goal:
 *                 type: integer
 *                 description: 0 = Fat loss, 1 = Muscle gain, 2 = Endurance
 *                 example: 1
 *               fitness_level:
 *                 type: integer
 *                 description: 0 = Beginner, 1 = Intermediate, 2 = Advanced
 *                 example: 0
 *               hours_per_week:
 *                 type: integer
 *                 example: 4
 *               has_equipment:
 *                 type: integer
 *                 description: 0 = No equipment, 1 = Has equipment
 *                 example: 1
 *     responses:
 *       200:
 *         description: Recommended workout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Workout recommendation generated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     workout:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [
 *                         "Bodyweight exercises (Push-ups, Squats, Planks)",
 *                         "Focus on bodyweight exercises",
 *                         "Try to aim for 3-4 workout sessions per week",
 *                         "With equipment, you can try more weight training exercises"
 *                       ]
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/estimate-calorie:
 *   post:
 *     summary: Estimate calories burned for an exercise
 *     tags: [Calories]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exercise
 *               - duration
 *               - weightKg
 *             properties:
 *               exercise:
 *                 type: string
 *                 example: push-ups
 *               duration:
 *                 type: number
 *                 description: Duration in minutes
 *                 example: 30
 *               weightKg:
 *                 type: number
 *                 description: User weight in kg
 *                 example: 70
 *     responses:
 *       200:
 *         description: Estimated calories burned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Calories estimated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     exercise:
 *                       type: string
 *                       example: push-ups
 *                     duration:
 *                       type: number
 *                       example: 30
 *                     weightKg:
 *                       type: number
 *                       example: 70
 *                     calories:
 *                       type: number
 *                       example: 280.5
 */

/**
 * @swagger
 * /user/workout-log:
 *   post:
 *     summary: Log a user's workout and calculate calories
 *     tags: [Workout]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, exercise, duration, weightKg]
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               exercise:
 *                 type: string
 *                 example: running
 *               duration:
 *                 type: number
 *                 example: 30
 *               weightKg:
 *                 type: number
 *                 example: 70
 *     responses:
 *       200:
 *         description: Workout logged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     exercise:
 *                       type: string
 *                     duration:
 *                       type: number
 *                     calories:
 *                       type: number
 */

/**
 * @swagger
 * /user/generate-workout:
 *   post:
 *     summary: Recommend a workout based on user input
 *     tags: [Workout]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goal
 *             properties:
 *               goal:
 *                 type: string
 *                 description: 0 = Fat loss, 1 = Muscle gain, 2 = Endurance
 *                 example: 1
 *     responses:
 *       200:
 *         description: Recommended workout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Workout recommendation generated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     workout:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [
 *                         "Bodyweight exercises (Push-ups, Squats, Planks)",
 *                         "Focus on bodyweight exercises",
 *                         "Try to aim for 3-4 workout sessions per week",
 *                         "With equipment, you can try more weight training exercises"
 *                       ]
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Server error
 */

exports.recommendWorkout = [
	async (req, res) => {
		try {
			const { age, goal, fitness_level, hours_per_week, has_equipment } =
				req.body;

			// Validate input (optional: add more robust checks here)
			if (
				age === undefined ||
				goal === undefined ||
				fitness_level === undefined ||
				hours_per_week === undefined ||
				has_equipment === undefined
			) {
				return sendErrorResponse(res, 400, "Missing required fields");
			}

			const userInput = {
				age: Number(req.body.age),
				goal: Number(req.body.goal),
				fitness_level: Number(req.body.fitness_level),
				hours_per_week: Number(req.body.hours_per_week),
				has_equipment: Number(req.body.has_equipment),
			};

			const workout = await Workout.recommendWorkout(userInput);

			return sendSuccessResponse(
				res,
				200,
				"Workout recommendation generated successfully",
				workout
			);
		} catch (error) {
			console.error(error);
			return sendErrorResponse(res, 500, "Server error", [error.message]);
		}
	},
];

exports.estimateCalories = async (req, res) => {
	try {
		const { exercise, duration, weightKg } = req.body;

		if (!exercise || !duration || !weightKg) {
			return sendErrorResponse(res, 400, "Missing required fields");
		}

		const calories = await Workout.calculateCaloriesBurned(
			exercise,
			duration,
			weightKg
		);

		if (calories === null) {
			return sendErrorResponse(res, 400, "Invalid exercise type");
		}
		console.log(calories);

		return sendSuccessResponse(res, 200, "Calories estimated successfully", {
			exercise,
			duration,
			weightKg,
			calories,
		});
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, "Server error");
	}
};

exports.logWorkout = async (req, res) => {
	try {
		const { user_id, exercise, duration, weightKg } = req.body;

		if (!user_id || !exercise || !duration || !weightKg) {
			return sendErrorResponse(res, 400, "Missing required fields");
		}

		const calories = await Workout.calculateCaloriesBurned(
			exercise,
			duration,
			weightKg
		);
		if (calories === null)
			return sendErrorResponse(res, 400, "Invalid exercise type");

		// Save to DB (you’d use your DB ORM here)
		await Workout.createLog({
			user_id,
			exercise,
			duration,
			weight_kg: weightKg,
			date: new Date(),
			calories_burned: calories,
		});

		return sendSuccessResponse(res, 200, "Workout logged successfully", {
			exercise,
			duration,
			calories,
		});
	} catch (err) {
		console.error(err);
		return sendErrorResponse(res, 500, "Server error");
	}
};

exports.generateWorkout = [
	async (req, res) => {
		try {
			const { goal, level, equipment } = req.body;

			// Validate input (optional: add more robust checks here)
			if (
				goal === undefined,
				level === undefined,
				equipment === undefined
			) {
				return sendErrorResponse(res, 400, "Missing required fields");
			}

			const workout = await Workout.generateWorkout(goal, level, equipment);

			return sendSuccessResponse(
				res,
				200,
				"Workout recommendation generated successfully",
				workout
			);
		} catch (error) {
			console.error(error);
			return sendErrorResponse(res, 500, "Server error", [error.message]);
		}
	},
];