const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse,
    getUrl
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
			return res
				.status(400)
				.json(sendErrorResponse("Class ID is required"));
		}

		try {
			const singleClass = await UserModel.Classes.findClassById(id);

			if (!singleClass) {
				return res
					.status(400)
					.json(sendErrorResponse("Class not found"));
			}

            singleClass.featured_img = getUrl(singleClass.featured_img, "image");

			return res
				.status(200)
				.json(sendSuccessResponse("Class retrieved successfully", singleClass));
		} catch (error) {
			return res
				.status(400)
				.json(
					sendErrorResponse("Error retrieving class", error.message)
				);
		}
	},
];

exports.classList = [
	async (req, res) => {
		try {
			const classes = await UserModel.Classes.listClasses(req.body);

			return res
				.status(200)
				.json(
					sendSuccessResponse("Classes retrieved successfully", classes)
				);
		} catch (error) {
			return res
				.status(500)
				.json(
					sendErrorResponse("Failed to retrieve classes", [
						error.message || "Internal Server Error",
					])
				);
		}
	},
];