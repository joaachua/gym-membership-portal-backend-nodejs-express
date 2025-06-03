const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse,
    getUrl,
    deleteUploadedFile
} = require("../../../services/helper");
const path = require("path");

const { Auth, UserModel } = require("../../models/models");

/**
 * @swagger
 * tags:
 *   name: User Centres
 *   description: API for getting user centre
 */

/**
 * @swagger
 * /user/centre/view:
 *   post:
 *     summary: View centre details by ID
 *     tags:
 *       - User Centres
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
 *         description: Centre details retrieved successfully
 *       400:
 *         description: Invalid centre ID or not found
 */

/**
 * @swagger
 * /user/centre/list:
 *   post:
 *     summary: Get a list of centres (with optional filters)
 *     tags:
 *       - User Centres
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
 *         description: List of centres retrieved successfully
 *       400:
 *         description: Failed to retrieve centre list
 */

exports.viewCentre = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return sendErrorResponse(res, 400, "Centre ID is required");
		}

		try {
			const singleCentre = await UserModel.Centres.findCentreById(id);

			if (!singleCentre) {
				return sendErrorResponse(res, 400, "Centre not found");
			}

			return sendSuccessResponse(res, 200, "Centre retrieved successfully", singleCentre);
		} catch (error) {
			return sendErrorResponse(res, 500, "Error retrieving centre", error.message);
		}
	},
];

exports.centreList = [
	async (req, res) => {
		try {
			const centres = await UserModel.Centres.listCentres(req.body);

			return sendSuccessResponse(res, 200, "Centres retrieved successfully", centres);
		} catch (error) {
			return sendErrorResponse(res, 500, "Failed to retrieve centres", [
				error.message || "Internal Server Error",
			]);
		}
	},
];