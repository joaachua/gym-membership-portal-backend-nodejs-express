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

exports.storeAds = [
	async (req, res) => {
		try {
			const result = await AdminModel.Ads.createAdvertisement(req.body);
			return res
				.status(200)
				.json(
					sendSuccessResponse("Advertisement created successfully", result)
				);
		} catch (error) {
			return res.status(400).json(sendErrorResponse(error.message));
		}
	},
];

exports.updateAds = [
	async (req, res) => {
		const {
			id,
			title,
			description,
			image,
			type,
			redirect_link,
			sequence,
			status,
		} = req.body;

		if (!id) {
			return res
				.status(400)
				.json(sendErrorResponse("Advertisement ID is required"));
		}

		const updateData = {
			title,
			description,
			image,
			type,
			redirect_link,
			sequence,
			status,
		};

		const result = await AdminModel.Ads.editAdvertisement(id, updateData);
		return res
			.status(200)
			.json(sendSuccessResponse("Ad updated successfully", result));
	},
];

exports.viewAds = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return res
				.status(400)
				.json(sendErrorResponse("Advertisement ID is required"));
		}

		try {
			const ad = await AdminModel.Ads.findAdvertisementById(id);

			if (!ad) {
				return res
					.status(400)
					.json(sendErrorResponse("Advertisement not found"));
			}

            ad.image = getUrl(ad.image, "image");

			return res
				.status(200)
				.json(sendSuccessResponse("Ad retrieved successfully", ad));
		} catch (error) {
			return res
				.status(400)
				.json(
					sendErrorResponse("Error retrieving advertisement", error.message)
				);
		}
	},
];

exports.deleteAds = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return res
				.status(400)
				.json(sendErrorResponse("Advertisement ID is required"));
		}

		try {
			const ad = await AdminModel.Ads.deleteAdvertisementById(id);

			if (!ad) {
				return res
					.status(400)
					.json(sendErrorResponse("Advertisement not found"));
			}

			return res
				.status(200)
				.json(sendSuccessResponse("Ad deleted successfully", ad));
		} catch (error) {
			return res
				.status(400)
				.json(sendErrorResponse("Error deleting advertisement", error.message));
		}
	},
];

exports.adsList = [
	async (req, res) => {
		try {
			const ads = await AdminModel.Ads.listAdvertisements(req.body);

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
