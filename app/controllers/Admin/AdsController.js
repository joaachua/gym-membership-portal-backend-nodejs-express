const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse,
    getUrl,
    deleteUploadedFile
} = require("../../../services/helper");
const path = require("path");

const { Auth, AdminModel } = require("../../models/models");

/**
 * @swagger
 * tags:
 *   name: Admin Advertisements
 *   description: API for managing admin Advertisements
 */

/**
 * @swagger
 * /admin/ads/upload-file:
 *   post:
 *     summary: Upload a file (PDF or image).
 *     description: Upload a file to the server. Only PDFs and image files are allowed.
 *     tags:
 *       - Admin Advertisements
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: File processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: File processed successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       file:
 *                         type: string
 *                         example: "sample-file.pdf"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "File is required"
 */

/**
 * @swagger
 * /admin/ads/store:
 *   post:
 *     summary: Create a new advertisement
 *     tags: [Admin Advertisements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdvertisementInput'
 *     responses:
 *       200:
 *         description: Advertisement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdvertisementResponse'
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /admin/ads/update:
 *   post:
 *     summary: Update an existing advertisement
 *     tags: [Admin Advertisements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdvertisementUpdateInput'
 *     responses:
 *       200:
 *         description: Advertisement updated successfully
 *       400:
 *         description: Invalid input or advertisement not found
 */

/**
 * @swagger
 * /admin/ads/view:
 *   post:
 *     summary: View a specific advertisement by ID
 *     tags: [Admin Advertisements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Advertisement retrieved successfully
 *       400:
 *         description: Advertisement not found
 */

/**
 * @swagger
 * /admin/ads/delete:
 *   post:
 *     summary: Delete an advertisement by ID
 *     tags: [Admin Advertisements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Advertisement deleted successfully
 *       400:
 *         description: Advertisement not found
 */

/**
 * @swagger
 * /admin/ads/list:
 *   post:
 *     summary: List advertisements with optional filters
 *     tags: [Admin Advertisements]
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

exports.uploadFile = [
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(res, 400, res, 400, "Validation failed", errors.array());
		}

		try {
			const file = req.file;

			if (!file) {
				return sendErrorResponse(res, 400, res, 400, "Validation failed", [
					{ 
						msg: "File is required" 
					},
				]);
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

				return sendErrorResponse(res, 400, res, 400, "Only pdf or image files are allowed");
			}

			const response = [{ file: file.filename }];

			return sendSuccessResponse(res, 200, res, 500, "File processed successfully", response);
		} catch (error) {
			sendErrorResponse(res, 400, res, 500, "Error processing file", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

exports.storeAds = [
	async (req, res) => {
		try {
			const result = await AdminModel.Ads.createAdvertisement(req.body);
			return sendSuccessResponse(res, 200, res, 200, "Advertisement created successfully", result);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, "Internal server error: ", error.message);
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
			return sendErrorResponse(res, 400, res, 400, "Advertisement ID is required");
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
		return sendSuccessResponse(res, 200, res, 200, "Ad updated successfully", result);
	},
];

exports.viewAds = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return sendErrorResponse(res, 400, res, 400, "Advertisement ID is required");
		}

		try {
			const ad = await AdminModel.Ads.findAdvertisementById(id);

			if (!ad) {
				return sendErrorResponse(res, 400, res, 400, "Advertisement not found");
			}

            ad.image = getUrl(ad.image, "image");

			return sendSuccessResponse(res, 200, res, 200, "Ad retrieved successfully", ad);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, "Error retrieving advertisement", error.message);
		}
	},
];

exports.deleteAds = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return sendErrorResponse(res, 400, res, 400, "Advertisement ID is required");
		}

		try {
			const ad = await AdminModel.Ads.deleteAdvertisementById(id);

			if (!ad) {
				return sendErrorResponse(res, 400, res, 400, "Advertisement not found");
			}

			return sendSuccessResponse(res, 200, res, 200, "Ad deleted successfully", ad);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, "Error deleting advertisement", error.message);
		}
	},
];

exports.adsList = [
	async (req, res) => {
		try {
			const ads = await AdminModel.Ads.listAdvertisements(req.body);

			return sendSuccessResponse(res, 200, res, 200, "Advertisements retrieved successfully", ads);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, "Failed to retrieve advertisements", [
				error.message || "Internal Server Error",
			]);
		}
	},
];
