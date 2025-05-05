const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse
} = require("../../../services/helper");

const { Auth, UserModel } = require("../../models/models");

/**
 * @swagger
 * tags:
 *   name: User Advertisements
 *   description: API for getting user Advertisements
 */

/**
 * @swagger
 * /user/ads/list:
 *   post:
 *     summary: List advertisements with optional filters
 *     tags: [User Advertisements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *               status:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               page:
 *                 type: integer
 *               perPage:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of advertisements
 */

exports.adsList = [
	async (req, res) => {
		try {
			const ads = await UserModel.Ads.listAdvertisements(req.body);

			return sendSuccessResponse(res, 200, res, 200, "Advertisements retrieved successfully", ads);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, "Failed to retrieve advertisements", [
				error.message || "Internal Server Error",
			]);
		}
	},
];
