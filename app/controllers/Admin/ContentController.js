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
			return sendSuccessResponse(res, 200, res, 200, "Content created successfully", result);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, error.message);
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
			return sendErrorResponse(res, 400, res, 400, "Content ID is required");
		}

		const updateData = {
			title,
			description,
			status,
		};

		const result = await AdminModel.Content.editContent(id, updateData);
		return sendSuccessResponse(res, 200, res, 200, "Content updated successfully", result);
	},
];

exports.viewContent = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return sendErrorResponse(res, 400, res, 400, "Content ID is required");
		}

		try {
			const content = await AdminModel.Content.findContentById(id);

			if (!content) {
				return sendErrorResponse(res, 400, res, 400, "Content not found");
			}

			return sendSuccessResponse(res, 200, res, 200, "Content retrieved successfully", content);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, "Error retrieving content", error.message);
		}
	},
];

exports.deleteContent = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return sendErrorResponse(res, 400, res, 400, "Content ID is required");
		}

		try {
			const content = await AdminModel.Content.deleteContentById(id);

			if (!content) {
				return sendErrorResponse(res, 400, res, 400, "Content not found");
			}

			return sendSuccessResponse(res, 200, res, 200, "Content deleted successfully", content);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, "Error deleting content", error.message);
		}
	},
];

exports.contentsList = [
	async (req, res) => {
		try {
			const contents = await AdminModel.Content.listContents(req.body);

			return sendSuccessResponse(res, 200, res, 200, "Contents retrieved successfully", contents);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, "Failed to retrieve contents", [
				error.message || "Internal Server Error",
			]);
		}
	},
];
