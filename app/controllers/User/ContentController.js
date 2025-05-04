const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse
} = require("../../../services/helper");

const { Auth, UserModel } = require("../../models/models");

exports.viewContent = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return res
				.status(400)
				.json(sendErrorResponse("Content ID is required"));
		}

		try {
			const content = await UserModel.Content.findContentById(id);

			if (!content) {
				return res
					.status(400)
					.json(sendErrorResponse("Content not found"));
			}

			return res
				.status(200)
				.json(sendSuccessResponse("Content retrieved successfully", content));
		} catch (error) {
			return res
				.status(400)
				.json(
					sendErrorResponse("Error retrieving content", error.message)
				);
		}
	},
];