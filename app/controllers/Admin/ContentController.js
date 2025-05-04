const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse
} = require("../../../services/helper");

const { Auth, AdminModel } = require("../../models/models");

exports.storeContent = [
	async (req, res) => {
		try {
			const result = await AdminModel.Content.createContent(req.body);
			return res
				.status(200)
				.json(
					sendSuccessResponse("Content created successfully", result)
				);
		} catch (error) {
			return res.status(400).json(sendErrorResponse(error.message));
		}
	},
];

exports.updateContent = [
	async (req, res) => {
		const {
			id,
			title,
			description,
			status,
		} = req.body;

		if (!id) {
			return res
				.status(400)
				.json(sendErrorResponse("Content ID is required"));
		}

		const updateData = {
			title,
			description,
			status,
		};

		const result = await AdminModel.Content.editContent(id, updateData);
		return res
			.status(200)
			.json(sendSuccessResponse("Content updated successfully", result));
	},
];

exports.viewContent = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return res
				.status(400)
				.json(sendErrorResponse("Content ID is required"));
		}

		try {
			const content = await AdminModel.Content.findContentById(id);

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

exports.deleteContent = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return res
				.status(400)
				.json(sendErrorResponse("Content ID is required"));
		}

		try {
			const content = await AdminModel.Content.deleteContentById(id);

			if (!content) {
				return res
					.status(400)
					.json(sendErrorResponse("Content not found"));
			}

			return res
				.status(200)
				.json(sendSuccessResponse("Content deleted successfully", content));
		} catch (error) {
			return res
				.status(400)
				.json(sendErrorResponse("Error deleting content", error.message));
		}
	},
];

exports.contentsList = [
	async (req, res) => {
		try {
			const contents = await AdminModel.Content.listContents(req.body);

			return res
				.status(200)
				.json(
					sendSuccessResponse("Contents retrieved successfully", contents)
				);
		} catch (error) {
			return res
				.status(500)
				.json(
					sendErrorResponse("Failed to retrieve contents", [
						error.message || "Internal Server Error",
					])
				);
		}
	},
];
