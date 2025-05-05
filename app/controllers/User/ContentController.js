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
			return sendErrorResponse(res, 400, "Content ID is required");
		}

		try {
			const content = await UserModel.Content.findContentById(id);

			if (!content) {
				return sendErrorResponse(res, 400, "Content not found");
			}

			return sendSuccessResponse(res, 200, "Content retrieved successfully", content);
		} catch (error) {
			return sendErrorResponse(res, 500, "Error retrieving content", error.message);
		}
	},
];