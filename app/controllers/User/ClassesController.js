const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse,
	getUrl,
} = require("../../../services/helper");
const path = require("path");

const { Auth, UserModel } = require("../../models/models");

/**
 * @swagger
 * tags:
 *   name: User Classes
 *   description: API for getting user class
 */

/**
 * @swagger
 * /user/class/view:
 *   post:
 *     summary: View class details by ID
 *     tags:
 *       - User Classes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Class details retrieved successfully
 *       400:
 *         description: Invalid class ID or not found
 */

/**
 * @swagger
 * /user/class/list:
 *   post:
 *     summary: Get a list of classes (with optional filters)
 *     tags:
 *       - User Classes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *               status:
 *                 type: integer
 *               page:
 *                 type: integer
 *               perPage:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of classes retrieved successfully
 *       400:
 *         description: Failed to retrieve class list
 */

exports.viewClass = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return sendErrorResponse(res, 400, "Class ID is required");
		}

		try {
			const singleClass = await UserModel.Classes.findClassById(id);

			if (!singleClass) {
				return sendErrorResponse(res, 400, "Class not found");
			}

			return sendSuccessResponse(
				res,
				200,
				"Class retrieved successfully",
				singleClass
			);
		} catch (error) {
			return sendErrorResponse(
				res,
				500,
				"Error retrieving class",
				error.message
			);
		}
	},
];

exports.registerClass = async (req, res) => {
	const { class_id } = req.body;

	try {
		const registrationId = await UserModel.Classes.registerClass({
			user_id: req.user.user_id,
			class_id,
		});

		sendSuccessResponse(res, 200, "Class registered successfully", {
			registration_id: registrationId,
		});
	} catch (err) {
		sendErrorResponse(res, 400, err.message, []);
	}
};

exports.userClassList = async (req, res) => {
	try {
		const user_classes = await UserModel.Classes.listUserClasses(
			req.user.user_id
		);

		sendSuccessResponse(
			res,
			200,
			"Class registered successfully",
			user_classes
		);
	} catch (err) {
		sendErrorResponse(res, 400, err.message, []);
	}
};

exports.classList = [
	async (req, res) => {
		try {
			const classes = await UserModel.Classes.listClasses(req.body);

			return sendSuccessResponse(
				res,
				200,
				"Classes retrieved successfully",
				classes
			);
		} catch (error) {
			return sendErrorResponse(res, 500, "Failed to retrieve classes", [
				error.message || "Internal Server Error",
			]);
		}
	},
];
