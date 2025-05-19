const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse,
} = require("../../../services/helper");
const Workout = require("../../models/User/Workout");

/**
 * @swagger
 * /user/estimate-calorie:
 *   post:
 *     summary: Estimate calories burned for an exercise
 *     tags: [Calories]
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
 * /user/workout-log/create:
 *   post:
 *     summary: Log a user's workout and calculate calories
 *     tags: [User Workout Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [exercise, duration, weightKg]
 *             properties:
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
 * /user/workout-log/update:
 *   post:
 *     summary: Edit a workout log
 *     tags: [User Workout Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - exercise
 *               - duration
 *               - weight_kg
 *             properties:
 *               id:
 *                 type: string
 *               exercise:
 *                 type: string
 *               duration:
 *                 type: number
 *               weight_kg:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               calories_burned:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated workout log successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/workout-log/view:
 *   post:
 *     summary: View a workout log by ID
 *     tags: [User Workout Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Retrieved workout log successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/workout-log/delete:
 *   post:
 *     summary: Delete a workout log
 *     tags: [User Workout Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deleted workout log successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/workout-log/list:
 *   get:
 *     summary: List all workout logs for the current user
 *     tags: [User Workout Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved workout log list successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/generate-workout:
 *   post:
 *     summary: Recommend a workout based on user input
 *     tags: [Workout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - muscle_group
 *               - equipment
 *               - rating
 *             properties:
 *               muscle_group:
 *                 type: string
 *                 description: 0 = Fat loss, 1 = Muscle gain, 2 = Endurance
 *                 example: Chest
 *               equipment:
 *                 type: string
 *                 description: 0 = Fat loss, 1 = Muscle gain, 2 = Endurance
 *                 example: Chest
 *               rating:
 *                 type: string
 *                 description: 0 = Fat loss, 1 = Muscle gain, 2 = Endurance
 *                 example: Chest
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
		const { exercise, duration, weightKg, calories_burned } = req.body;

		if (!exercise || !duration || !weightKg) {
			return sendErrorResponse(res, 400, "Missing required fields");
		}

		await Workout.createLog({
			user_id: req.user.user_id,
			exercise,
			duration,
			weight_kg: weightKg,
			date: new Date(),
			calories_burned: calories_burned,
		});

		return sendSuccessResponse(res, 200, "Workout logged successfully", {
			exercise,
			duration,
			calories_burned,
		});
	} catch (err) {
		console.error(err);
		return sendErrorResponse(res, 500, err || "Server error");
	}
};

exports.editLog = async (req, res) => {
	try {
		const { id, exercise, duration, weight_kg, date, calories_burned } = req.body;

		if (!exercise || !duration || !weight_kg) {
			return sendErrorResponse(res, 400, "Missing required fields");
		}

		await Workout.editLog(id, {
			exercise,
			duration,
			weight_kg,
			date,
			calories_burned,
		});

		return sendSuccessResponse(res, 200, "Updated workout log successfully");
	} catch (err) {
		console.error(err);
		return sendErrorResponse(res, 500, err || "Server error");
	}
};

exports.viewLog = async (req, res) => {
	try {
		const { id } = req.body;

		const response = await Workout.viewLog(id);

		return sendSuccessResponse(res, 200, "Retrieved workout log successfully", response);
	} catch (err) {
		console.error(err);
		return sendErrorResponse(res, 500, err || "Server error");
	}
};

exports.deleteLog = async (req, res) => {
	try {
		const { id } = req.body;

		await Workout.deleteLog(id);

		return sendSuccessResponse(res, 200, "Deleted workout log successfully");
	} catch (err) {
		console.error(err);
		return sendErrorResponse(res, 500, err || "Server error");
	}
};

exports.logList = async (req, res) => {
	try {
		const response = await Workout.logList(req.user.user_id);

		return sendSuccessResponse(res, 200, "Retrieved workout log list successfully", response);
	} catch (err) {
		console.error(err);
		return sendErrorResponse(res, 500, err || "Server error");
	}
};

exports.generateWorkout = [
	async (req, res) => {
		try {
			const { muscle_group, equipment, rating } = req.body;

			// Validate input (optional: add more robust checks here)
			if (
				muscle_group === undefined,
				equipment === undefined,
				rating === undefined
			) {
				return sendErrorResponse(res, 400, "Missing required fields");
			}

			const workout = await Workout.generateWorkout(muscle_group, equipment, rating);

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