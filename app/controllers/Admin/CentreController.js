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
 *   name: Admin Centres
 *   description: API for getting admin centre
 */

/**
 * @swagger
 * /admin/centre/upload-file:
 *   post:
 *     summary: Upload a file (PDF or image).
 *     description: Upload a file to the server. Only PDFs and image files are allowed.
 *     tags:
 *       - Admin Centres
 *     security:
 *       - bearerAuth: []
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
 * /admin/centre/store:
 *   post:
 *     summary: Create a new centre
 *     description: Store a new centre with required information.
 *     tags:
 *       - Admin Centres
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               featured_img:
 *                 type: string
 *               trainer_id:
 *                 type: integer
 *               is_recurring:
 *                 type: boolean
 *               recurrence_pattern:
 *                 type: string
 *               status:
 *                 type: integer
 *             required:
 *               - title
 *               - description
 *     responses:
 *       200:
 *         description: Centre created successfully
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
 *                   example: Centre created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Validation failed
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
 *                   example: Title and description are required
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Title and description are required"
 */

/**
 * @swagger
 * /admin/centre/update:
 *   post:
 *     summary: Update an existing centre
 *     tags:
 *       - Admin Centres
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               featured_img:
 *                 type: string
 *               trainer_id:
 *                 type: integer
 *               is_recurring:
 *                 type: boolean
 *               recurrence_pattern:
 *                 type: string
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Centre updated successfully
 *       400:
 *         description: Update failed
 */

/**
 * @swagger
 * /admin/centre/view:
 *   post:
 *     summary: View centre details by ID
 *     tags:
 *       - Admin Centres
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Centre details retrieved successfully
 *       400:
 *         description: Invalid centre ID or not found
 */

/**
 * @swagger
 * /admin/centre/delete:
 *   post:
 *     summary: Delete a centre by ID
 *     tags:
 *       - Admin Centres
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Centre deleted successfully
 *       400:
 *         description: Centre not found or delete failed
 */

/**
 * @swagger
 * /admin/centre/list:
 *   post:
 *     summary: Get a list of centres (with optional filters)
 *     tags:
 *       - Admin Centres
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *               status:
 *                 type: integer
 *               page:
 *                 type: integer
 *               perPage:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of centres retrieved successfully
 *       400:
 *         description: Failed to retrieve centre list
 */

exports.uploadFile = [
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(res, 400, "Validation failed", errors.array());
		}

		try {
			const file = req.file;

			if (!file) {
				return sendErrorResponse(res, 400, "Validation failed", [
					{ msg: "File is required" },
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

				return sendErrorResponse(res, 400, "Only pdf or image files are allowed");
			}

			const response = [{ file: file.filename }];

			return sendSuccessResponse(res, 200, "File processed successfully", response);
		} catch (error) {
			sendErrorResponse(res, 500, "Error processing file", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

exports.storeCentre = [
	async (req, res) => {
		try {
			const result = await AdminModel.Centres.createCentre(req.body);
			return sendSuccessResponse(res, 200, "Centre created successfully", result);
		} catch (error) {
			return sendErrorResponse(res, 500, error.message);
		}
	},
];

exports.updateCentre = [
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
			return sendErrorResponse(res, 400, "Centre ID is required");
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

		const result = await AdminModel.Centres.editCentre(id, updateData);
		return sendSuccessResponse(res, 200, "Centre updated successfully", result);
	},
];

exports.viewCentre = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return sendErrorResponse(res, 400, "Centre ID is required");
		}

		try {
			const singleCentre = await AdminModel.Centres.findCentreById(id);

			if (!singleCentre) {
				return sendErrorResponse(res, 400, "Centre not found");
			}

            singleCentre.featured_img = getUrl(singleCentre.featured_img, "image");

			return sendSuccessResponse(res, 200, "Centre retrieved successfully", singleCentre);
		} catch (error) {
			return sendErrorResponse(res, 500, "Error retrieving centre", error.message);
		}
	},
];

exports.deleteCentre = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return sendErrorResponse(res, 400, "Centre ID is required");
		}

		try {
			const singleCentre = await AdminModel.Centres.deleteCentreById(id);

			if (!singleCentre) {
				return sendErrorResponse(res, 400, "Centre not found");
			}

			return sendSuccessResponse(res, 200, "Centre deleted successfully", singleCentre);
		} catch (error) {
			return sendErrorResponse(res, 500, "Error deleting centre", error.message);
		}
	},
];

exports.centreList = [
	async (req, res) => {
		try {
			const centres = await AdminModel.Centres.listCentres(req.body);

			return sendSuccessResponse(res, 200, "Centres retrieved successfully", centres);
		} catch (error) {
			return sendErrorResponse(res, 500, "Failed to retrieve centres", [
				error.message || "Internal Server Error",
			]);
		}
	},
];