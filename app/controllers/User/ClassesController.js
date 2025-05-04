const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse,
    getUrl,
    deleteUploadedFile
} = require("../../../services/helper");
const path = require("path");

const { Auth, UserModel } = require("../../models/models");

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