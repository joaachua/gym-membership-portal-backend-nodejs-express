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
 *   name: Admin Classes
 *   description: API for getting admin class
 */

/**
 * @swagger
 * /admin/class/upload-file:
 *   post:
 *     summary: Upload a file (PDF or image).
 *     description: Upload a file to the server. Only PDFs and image files are allowed.
 *     tags:
 *       - Admin Classes
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
 * /admin/class/store:
 *   post:
 *     summary: Create a new class
 *     description: Store a new class with required information.
 *     tags:
 *       - Admin Classes
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
 *         description: Class created successfully
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
 *                   example: Class created successfully
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
 * /admin/class/update:
 *   post:
 *     summary: Update an existing class
 *     tags:
 *       - Admin Classes
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
 *         description: Class updated successfully
 *       400:
 *         description: Update failed
 */

/**
 * @swagger
 * /admin/class/view:
 *   post:
 *     summary: View class details by ID
 *     tags:
 *       - Admin Classes
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
 *         description: Class details retrieved successfully
 *       400:
 *         description: Invalid class ID or not found
 */

/**
 * @swagger
 * /admin/class/delete:
 *   post:
 *     summary: Delete a class by ID
 *     tags:
 *       - Admin Classes
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
 *         description: Class deleted successfully
 *       400:
 *         description: Class not found or delete failed
 */

/**
 * @swagger
 * /admin/class/list:
 *   post:
 *     summary: Get a list of classes (with optional filters)
 *     tags:
 *       - Admin Classes
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
 *         description: List of classes retrieved successfully
 *       400:
 *         description: Failed to retrieve class list
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

				return sendErrorResponse(res, 400, res, 400, "Only pdf or image files are allowed");
			}

			const response = [{ file: file.filename }];

			return sendSuccessResponse(res, 200, res, 200, "File processed successfully", response);
		} catch (error) {
			sendErrorResponse(res, 400, res, 500, "Error processing file", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

exports.storeClass = [
	async (req, res) => {
		try {
			const result = await AdminModel.Classes.createClass(req.body);
			return sendSuccessResponse(res, 200, res, 200, "Class created successfully", result);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, error.message);
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
			return sendErrorResponse(res, 400, res, 400, "Class ID is required");
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
		return sendSuccessResponse(res, 200, res, 200, "Class updated successfully", result);
	},
];

exports.viewClass = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return sendErrorResponse(res, 400, res, 400, "Class ID is required");
		}

		try {
			const singleClass = await AdminModel.Classes.findClassById(id);

			if (!singleClass) {
				return sendErrorResponse(res, 400, res, 400, "Class not found");
			}

            singleClass.featured_img = getUrl(singleClass.featured_img, "image");

			return sendSuccessResponse(res, 200, res, 200, "Class retrieved successfully", singleClass);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, "Error retrieving class", error.message);
		}
	},
];

exports.deleteClass = [
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return sendErrorResponse(res, 400, res, 400, "Class ID is required");
		}

		try {
			const singleClass = await AdminModel.Classes.deleteClassById(id);

			if (!singleClass) {
				return sendErrorResponse(res, 400, res, 400, "Class not found");
			}

			return sendSuccessResponse(res, 200, res, 200, "Class deleted successfully", singleClass);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, "Error deleting class", error.message);
		}
	},
];

exports.classList = [
	async (req, res) => {
		try {
			const classes = await AdminModel.Classes.listClasses(req.body);

			return sendSuccessResponse(res, 200, res, 200, "Classes retrieved successfully", classes);
		} catch (error) {
			return sendErrorResponse(res, 400, res, 500, "Failed to retrieve classes", [
				error.message || "Internal Server Error",
			]);
		}
	},
];