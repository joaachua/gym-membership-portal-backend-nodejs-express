const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse
} = require("../../../services/helper");

const { Auth, UserModel } = require("../../models/models");

exports.adsList = [
	async (req, res) => {
		try {
			const ads = await UserModel.Ads.listAdvertisements(req.body);

			return res
				.status(200)
				.json(
					sendSuccessResponse("Advertisements retrieved successfully", ads)
				);
		} catch (error) {
			return res
				.status(500)
				.json(
					sendErrorResponse("Failed to retrieve advertisements", [
						error.message || "Internal Server Error",
					])
				);
		}
	},
];
