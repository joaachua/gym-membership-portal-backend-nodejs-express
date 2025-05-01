const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse,
    getUrl,
    deleteUploadedFile
} = require("../../../services/helper");
const path = require("path");

const { Auth, AdminModel } = require("../../models/models");

exports.uploadFile = [
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json(sendErrorResponse("Validation failed", errors.array()));
		}

		try {
			const file = req.file;

			if (!file) {
				return res
					.status(400)
					.json(
						sendErrorResponse("Validation failed", [
							{ msg: "File is required" },
						])
					);
			}

			const allowedMimeTypes = ["application/pdf"];

			if (
				!file.mimetype.startsWith("image/") &&
				!allowedMimeTypes.includes(file.mimetype)
			) {
				const filePath = path.join(
					__dirname,
					"../../",
					"uploads/images",
					file.filename
				);
				deleteUploadedFile(filePath);

				return res
					.status(400)
					.json(sendErrorResponse("Only pdf or image files are allowed"));
			}

			const response = [{ file: file.filename }];

			return res
				.status(200)
				.json(sendSuccessResponse("File processed successfully", response));
		} catch (error) {
			res
				.status(400)
				.json(
					sendErrorResponse("Error processing file", [
						error.message || "Internal Server Error",
					])
				);
		}
	},
];

exports.storeClass = [
	async (req, res) => {
		try {
			const result = await AdminModel.Classes.createClass(req.body);
			return res
				.status(200)
				.json(
					sendSuccessResponse("Class created successfully", result)
				);
		} catch (error) {
			return res.status(400).json(sendErrorResponse(error.message));
		}
	},
];

exports.updateClass = [
	async (req, res) => {
		const {
			id,
			title, 
            description, 
            featured_img, 
            trainer_id,
            is_recurring, 
            recurrence_pattern, 
            status,
            schedules
		} = req.body;

		if (!id) {
			return res
				.status(400)
				.json(sendErrorResponse("Class ID is required"));
		}

		const updateData = {
			title,
			description,
            featured_img, 
            trainer_id,
            is_recurring, 
            recurrence_pattern, 
            status,
            schedules
		};

		const result = await AdminModel.Classes.editClass(id, updateData);
		return res
			.status(200)
			.json(sendSuccessResponse("Class updated successfully", result));
	},
];

exports.viewClass = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return res
				.status(400)
				.json(sendErrorResponse("Class ID is required"));
		}

		try {
			const singleClass = await AdminModel.Classes.findClassById(id);

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

exports.deleteClass = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return res
				.status(400)
				.json(sendErrorResponse("Class ID is required"));
		}

		try {
			const singleClass = await AdminModel.Classes.deleteClassById(id);

			if (!singleClass) {
				return res
					.status(400)
					.json(sendErrorResponse("Class not found"));
			}

			return res
				.status(200)
				.json(sendSuccessResponse("Class deleted successfully", singleClass));
		} catch (error) {
			return res
				.status(400)
				.json(sendErrorResponse("Error deleting class", error.message));
		}
	},
];

exports.classList = [
	async (req, res) => {
		try {
			const classes = await AdminModel.Classes.listClasses(req.body);

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