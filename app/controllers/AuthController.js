require("dotenv").config({ path: "../../.env" });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Auth = require("../models/Auth");
const { sendMail } = require("../../services/send-mail");
const {
	sendSuccessResponse,
	sendErrorResponse,
} = require("../../services/helper");
const { body, validationResult } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: Admin Auth
 *   description: Admin authentication management
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: your_jwt_token
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: adminuser
 *                 full_name:
 *                   type: string
 *                   example: Admin User
 *                 email:
 *                   type: string
 *                   example: admin@example.com
 *                 phone_number:
 *                   type: string
 *                   example: "1234567890"
 *                 platform:
 *                   type: integer
 *                   example: 2
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       permission_group:
 *                         type: string
 *                         example: User Management
 *                       permission_name:
 *                         type: string
 *                         example: List
 *                   example:
 *                     - permission_group: User Management
 *                       permission_name: List
 *                     - permission_group: User Management
 *                       permission_name: View
 *                     - permission_group: User Management
 *                       permission_name: Delete
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Admin email not found
 *       403:
 *         description: Access denied
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Error logging in
 */

/**
 * @swagger
 * /admin/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Admin Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: User email not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Error processing the password reset request
 */

/**
 * @swagger
 * /admin/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Admin Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: your_reset_token
 *               password:
 *                 type: string
 *                 example: newpassword
 *               confirm_password:
 *                 type: string
 *                 example: newpassword
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Validation failed
 *       403:
 *         description: Access denied
 *       500:
 *         description: Error resetting password
 */

/**
 * @swagger
 * /admin/profile:
 *   post:
 *     summary: View Admin Profile
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 73
 *                 username:
 *                   type: string
 *                   example: adminuser
 *                 full_name:
 *                   type: string
 *                   example: Admin User
 *                 role:
 *                   type: string
 *                   example: Admin
 *                 email:
 *                   type: string
 *                   example: admin@example.com
 *                 phone_number:
 *                   type: string
 *                   example: "1234567890"
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error retreiving admin
 */

/**
 * @swagger
 * /admin/update-profile:
 *   post:
 *     summary: Update admin profile
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone_number:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Profile update successfully
 *       400:
 *         description: Validation failed
 *       402:
 *         description: Username already exists
 *       404:
 *         description: Email not found
 *       500:
 *         description: Error updating profile
 */

/**
 * @swagger
 * /admin/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               old_password:
 *                 type: string
 *                 example: oldpassword
 *               new_password:
 *                 type: string
 *                 example: newpassword
 *               confirm_password:
 *                 type: string
 *                 example: confirmnewpassword
 *     responses:
 *       200:
 *         description: Password change successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid old password
 *       402:
 *         description: New password cannot be the same as old password
 *       500:
 *         description: Error changing password
 */

/**
 * @swagger
 * tags:
 *   name: User Auth
 *   description: User authentication management
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               salutation:
 *                 type: string
 *                 example: MR.
 *               email:
 *                 type: string
 *                 example: reg_user@example.com
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *               phone_number:
 *                 type: string
 *                 example: +1234567890
 *               password:
 *                 type: string
 *                 example: Password123
 *               platform:
 *                 type: integer
 *                 enum: [1, 2]
 *                 example: 1
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 full_name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 phone_number:
 *                   type: string
 *                   example: +1234567890
 *       400:
 *         description: Validation failed or user already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login and receive a token
 *     tags: [User Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@user.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               fcm_token:
 *                 type: string
 *                 example: a1b2c3d4e5f6g7h8i9j0
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Validation failed or user email not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/verify-otp:
 *   post:
 *     summary: Verify OTP and receive a token
 *     tags: [User Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@user.com
 *               otp_code:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: your-jwt-token
 *                 email:
 *                   type: string
 *                   example: test@user.com
 *                 message:
 *                   type: string
 *                   example: User has been successfully verified.
 *       400:
 *         description: Validation failed or invalid OTP
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/resend-otp:
 *   post:
 *     summary: Resend OTP to the user
 *     tags: [User Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@user.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: test@user.com
 *                     username:
 *                       type: string
 *                       example: testuser
 *       400:
 *         description: Validation failed or invalid email
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [User Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@user.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset email sent successfully.
 *       400:
 *         description: Validation failed or user email not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/verify-reset-otp:
 *   post:
 *     summary: Verify OTP for password reset and generate a reset token
 *     tags: [User Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@user.com
 *               reset_otp_code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully and reset token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: test@user.com
 *                 reset_token:
 *                   type: string
 *                   example: "a4f7e26759c91d34e6a9adf154763c7fbc8e01bb42c1b4a18b2b3bbafc5d7202"
 *                 message:
 *                   type: string
 *                   example: "Password reset token generated. Please use it to reset your password."
 *       400:
 *         description: Validation failed or OTP code missing
 *       401:
 *         description: Invalid OTP or OTP expired
 *       404:
 *         description: User not found for the provided email
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Reset the user password
 *     tags: [User Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: 123456abcdef
 *               password:
 *                 type: string
 *                 example: NewPassword123
 *               confirm_password:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully.
 *       400:
 *         description: Invalid or expired reset token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: Change the user password
 *     tags: [User Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@user.com
 *               old_password:
 *                 type: string
 *                 example: OldPassword123
 *               new_password:
 *                 type: string
 *                 example: NewPassword123
 *               confirm_password:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully.
 *       400:
 *         description: Validation failed or user not found
 *       401:
 *         description: Invalid old password
 *       402:
 *         description: New password cannot be the same as old password
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/check-passcode:
 *   post:
 *     summary: Check user passcode field
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 passcode:
 *                   type: boolean
 *                   example: 0
 *       401:
 *         description: Unauthorized error
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
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Invalid token"]
 *       404:
 *         description: User not found
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
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["User does not exist"]
 *       500:
 *         description: Internal Server Error
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
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Error fetching user profile
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Unexpected error occurred"]
 */

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [User Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successfully.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error logging out.
 */

// Admin Login Validation
exports.loginAdmin = [
	body("email").isEmail().withMessage("Email must be a valid email address"),

	body("password")
		.exists()
		.withMessage("Password is required")
		.isString()
		.withMessage("Password must be a string")
		.isLength({ min: 6, max: 100 })
		.withMessage("Password must be between 6 and 100 characters"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		const { email, password } = req.body;
		try {
			const admin = await Auth.findUserByEmail(email);
			if (!admin) {
				return sendErrorResponse(res, 400, "Admin email not found");
			}

			if (admin.platform !== 2) {
				return sendErrorResponse(
					res,
					400,
					"Access denied. You are not an admin"
				);
			}

			if (!admin.password) {
				return sendErrorResponse(
					res,
					400,
					"Invalid credentials. No password set for this admin."
				);
			}

			const passwordMatch = await bcrypt.compare(password, admin.password);
			if (!passwordMatch) {
				return sendErrorResponse(
					res,
					400,
					"Invalid credentials. Password is incorrect."
				);
			}

			const token = jwt.sign(
				{
					id: admin.id,
					email: admin.email,
					platform: admin.platform,
				},
				process.env.JWT_SECRET,
				{ expiresIn: "24h" }
			);

			const permissions = await Auth.findPermissionsByEmail(email);

			sendSuccessResponse(res, 200, "Login successful.", {
				token,
				id: admin.id,
				username: admin.username,
				full_name: admin.full_name,
				email: admin.email,
				phone_number: admin.phone_number,
				platform: admin.platform,
				permissions,
			});
		} catch (error) {
			sendErrorResponse(res, 400, "Error logging in.", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

// Forgot password
exports.forgotPassword = [
	body("email").isEmail().withMessage("Email must be a valid email address"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		const { email } = req.body;
		try {
			const admin = await Auth.findUserByEmail(email);
			if (!admin) {
				return sendErrorResponse(res, 400, "User email not found");
			}

			if (admin.platform !== 2) {
				return sendErrorResponse(
					res,
					400,
					"Access denied. You are not an admin"
				);
			}

			const token = crypto.randomBytes(32).toString("hex");
			const resetTokenExpiresAt = new Date(Date.now() + 3600000);

			await Auth.updateResetToken(email, token, resetTokenExpiresAt);

			const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

			await sendMail(email, "Password Reset Request", "forgot-password", {
				name: admin.full_name || "User",
				resetLink,
			});

			sendSuccessResponse(res, 200, "Password reset email sent successfully.");
		} catch (error) {
			sendErrorResponse(
				res,
				400,
				"Error processing the password reset request.",
				[error.message || "Internal Server Error"]
			);
		}
	},
];

// Reset password
exports.resetPassword = [
	body("token").notEmpty().withMessage("Token is required"),

	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),

	body("confirm_password")
		.isLength({ min: 6 })
		.withMessage("Confirm password must be at least 6 characters long")
		.custom((value, { req }) => value === req.body.password)
		.withMessage("Passwords do not match"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		const { token, password } = req.body;
		try {
			const admin = await Auth.findAdminByResetToken(token);
			if (!admin) {
				return sendErrorResponse(res, 400, "Invalid or expired reset token");
			}

			if (admin.platform !== 2) {
				return sendErrorResponse(
					res,
					400,
					"Access denied. You are not an admin"
				);
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const response = await Auth.updatePassword(admin.id, hashedPassword);

			if (response) {
				await Auth.clearResetToken(admin.id);

				await sendMail(
					admin.email,
					"Password Reset Successfully",
					"reset-password",
					{
						name: admin.full_name || "Admin",
					}
				);

				// Add success response here
				return sendSuccessResponse(res, 200, "Password reset successfully.");
			} else {
				// Handle unexpected failure during password update
				return sendErrorResponse(res, 400, "Failed to update password.");
			}
		} catch (error) {
			console.error("Error resetting password:", error);
			sendErrorResponse(res, 400, "Error resetting password.", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

// View admin profile
exports.getAdminProfile = [
	async (req, res) => {
		const id = req.user.id;
		try {
			const admin = await Auth.findUserById(id);
			if (!admin) {
				return sendErrorResponse(res, 400, "Admin not found");
			}
			sendSuccessResponse(res, 200, "Admin retrieved successfully", admin);
		} catch (error) {
			sendErrorResponse(res, 400, "Error retrieving admin", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

// Edit admin
exports.updateProfile = [
	body("username")
		.optional()
		.isString()
		.withMessage("Username must be a string")
		.isLength({ min: 3, max: 30 })
		.withMessage("Username must be between 3 and 30 characters")
		.matches(/^[a-zA-Z0-9_]+$/)
		.withMessage("Username can only contain letters, numbers, and underscores"),

	body("full_name")
		.optional()
		.isString()
		.withMessage("Full Name must be a string")
		.isLength({ min: 3, max: 50 })
		.withMessage("Full Name must be between 3 and 50 characters"),

	body("role").optional().isString().withMessage("Role name must be a string"),

	body("email")
		.optional()
		.isEmail()
		.withMessage("Email must be a valid email address")
		.isLength({ max: 100 })
		.withMessage("Email must be less than 100 characters"),

	body("phone_number")
		.optional()
		.matches(/^\+?\d{10,15}$/)
		.withMessage(
			'Phone Number must be between 10 and 15 digits and can optionally start with a "+"'
		),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		const { username, full_name, role, email, phone_number } = req.body;
		const id = req.user.id;
		try {
			const existingAdmin = await Auth.findUserById(id);
			if (!existingAdmin) {
				return sendErrorResponse(res, 400, "Admin not found", []);
			}
			if (email) {
				const existingUserEmail = await Auth.findUserByEmail(email);
				if (existingUserEmail && existingUserEmail.id !== id) {
					return sendErrorResponse(res, 400, "Email already exists", []);
				}
			}

			if (username) {
				const existingUserName = await Auth.findAdminByUsername(username);
				if (existingUserName && existingUserName.id !== id) {
					return sendErrorResponse(res, 400, "Username already exists", []);
				}
			}

			const updatedAdmin = await Auth.updateUserProfile(id, {
				username,
				full_name,
				role,
				email,
				phone_number,
			});

			sendSuccessResponse(res, 200, "Admin updated successfully", updatedAdmin);
		} catch (error) {
			sendErrorResponse(res, 400, "Error update admin", [
				error.message || "Internal Server Error",
			]);
		}
	},
];
// Change Password
exports.changePassword = [
	body("email")
		.isEmail()
		.withMessage("Email must be a valid email address")
		.isLength({ max: 100 })
		.withMessage("Email must be less than 100 characters"),

	body("new_password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),

	body("confirm_password")
		.isLength({ min: 6 })
		.withMessage("Confirm password must be at least 6 characters long")
		.custom((value, { req }) => value === req.body.new_password)
		.withMessage("Passwords do not match"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		const { email, old_password, new_password, confirm_password } = req.body;
		try {
			const admin = await Auth.findUserByEmail(email);

			const result = await bcrypt.compare(old_password, admin.password);
			if (!result) {
				return sendErrorResponse(res, 400, "Invalid old password");
			}

			if (old_password == new_password) {
				return sendErrorResponse(
					res,
					400,
					"New password cannot be the same as old password"
				);
			}

			const hashedPassword = await bcrypt.hash(new_password, 10);
			await Auth.updatePassword(admin.id, hashedPassword);

			sendSuccessResponse(res, 200, "Password change successfully.");
		} catch (error) {
			sendErrorResponse(res, 400, "Error changeing password.", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

// User registration
exports.registerUser = [
	body("salutation")
		.optional()
		.isString()
		.withMessage("Salutation must be a string"),

	body("full_name")
		.isString()
		.withMessage("Full Name must be a string")
		.isLength({ min: 3, max: 50 })
		.withMessage("Full Name must be between 3 and 50 characters"),

	body("phone_number")
		.matches(/^\+?\d{10,15}$/)
		.withMessage(
			'Phone Number must be between 10 and 15 digits and can optionally start with a "+"'
		),

	body("email")
		.isEmail()
		.withMessage("Email must be a valid email address")
		.isLength({ max: 100 })
		.withMessage("Email must be less than 100 characters"),

	body("password")
		.optional()
		.isString()
		.withMessage("Password must be a string")
		.isLength({ min: 8, max: 100 })
		.withMessage("Password must be between 8 and 100 characters"),

	body("platform")
		.isNumeric()
		.withMessage("Platform must be a number")
		.isIn([1, 2])
		.withMessage("Platform must be either 1 or 2"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		try {
			let hashedPassword = null;
			if (req.body.password) {
				hashedPassword = await bcrypt.hash(req.body.password, 10);
			}

			// Check if the user already exists and is verified
			const existingUser = await Auth.findUserByEmail(req.body.email);
			if (existingUser) {
				if (existingUser.platform === 2) {
					return sendErrorResponse(
						res,
						400,
						"Please access the admin portal for this account."
					);
				}

				if (existingUser.is_verified) {
					return sendErrorResponse(res, 400, "Email is already registered.");
				} else {
					// Update existing non-verified user
					const updateUser = await Auth.updateUserProfile(existingUser.id, {
						salutation: req.body.salutation,
						full_name: req.body.full_name,
						phone_number: req.body.phone_number,
						password: hashedPassword,
					});

					if (!updateUser) {
						return sendErrorResponse(res, 400, "Error updating user.");
					}

					const otpCode = crypto.randomInt(100000, 999999).toString();
					const otpSentAt = new Date();

					await Auth.updateUserOTP(existingUser.email, otpCode, otpSentAt);

					try {
						await sendMail(existingUser.email, "Your OTP Code", "otp-token", {
							name: existingUser.full_name || "User",
							otp_code: otpCode,
							supportLink: "https://support.example.com",
						});
					} catch (emailError) {
						return sendErrorResponse(res, 400, "Error sending OTP email.", [
							emailError.message || "Internal Server Error",
						]);
					}

					return sendSuccessResponse(res, 200, "OTP sent successfully");
				}
			}

			const newUserId = await Auth.registerUser({
				salutation: req.body.salutation,
				email: req.body.email,
				username: req.body.username,
				full_name: req.body.full_name,
				phone_number: req.body.phone_number,
				password: hashedPassword,
				platform: req.body.platform,
			});

			const newUser = await Auth.findUserById(newUserId);

			const otpCode = crypto.randomInt(100000, 999999).toString();
			const otpSentAt = new Date();

			await Auth.updateUserOTP(newUser.email, otpCode, otpSentAt);

			try {
				await sendMail(newUser.email, "Your OTP Code", "otp-token", {
					name: newUser.full_name || "User",
					otp_code: otpCode,
					supportLink: "https://support.example.com",
				});
			} catch (emailError) {
				return sendErrorResponse(res, 400, "Error sending OTP email.", [
					emailError.message || "Internal Server Error",
				]);
			}

			return sendSuccessResponse(res, 200, "OTP sent successfully");
		} catch (error) {
			sendErrorResponse(res, 400, "Error registering user", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

// User Login
exports.loginUser = [
	body("email")
		.isEmail()
		.withMessage("Email must be a valid email address")
		.isLength({ max: 100 })
		.withMessage("Email must be less than 100 characters"),

	body("password")
		.isString()
		.withMessage("Password must be a string")
		.isLength({ min: 8, max: 100 })
		.withMessage("Password must be between 8 and 100 characters"),

	body("fcm_token")
		.optional()
		.isString()
		.withMessage("FCM token must be a string"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		try {
			const user = await Auth.findUserByEmail(req.body.email);
			if (!user) {
				return sendErrorResponse(res, 400, "User email not found");
			}

			if (user && user.platform === 2) {
				return sendErrorResponse(
					res,
					400,
					"Please access the admin portal for this account."
				);
			}

			if (user && !user.is_verified) {
				return sendErrorResponse(
					res,
					400,
					"User is not verified. Please go through verification process by registering account with this email address again."
				);
			}

			const passwordMatch = await bcrypt.compare(
				req.body.password,
				user.password
			);

            console.log("Entered password:", req.body.password);
            console.log("Stored hash:", user.password);

			if (!passwordMatch) {
				return sendErrorResponse(res, 400, "Invalid password.");
			}

			const token = jwt.sign(
				{
					user_id: user.id,
					email: user.email,
					signedAt: new Date().toISOString(),
				},
				process.env.JWT_SECRET,
				{ expiresIn: "24h" }
			);

			//await UserLoginHistory.createLoginHistory({ user_id: user.id });

			// Update FCM token
			if (req.body.fcm_token) {
				await Auth.updateUserFCMToken(user.id, req.body.fcm_token);
			}

			sendSuccessResponse(res, 200, "Login successfully.", {
				token,
				user,
			});
		} catch (error) {
			sendErrorResponse(res, 400, "Error logging in.", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

// register auth verify otp
exports.verifyOTP = [
	body("email")
		.isEmail()
		.withMessage("Email must be a valid email address")
		.isLength({ max: 100 })
		.withMessage("Email must be less than 100 characters"),

	body("otp_code").notEmpty().withMessage("OTP is required"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		try {
			const user = await Auth.findUserByEmail(req.body.email);
			if (!user) {
				return sendErrorResponse(res, 400, "User email not found.");
			}

			const isOtpValid = user.otp_code === req.body.otp_code;
			const otpExpiryDuration = 180000;
			const isOtpNotExpired =
				new Date() - new Date(user.otp_sent_at) <= otpExpiryDuration;

			if (!isOtpValid) {
				return sendErrorResponse(res, 400, "Invalid OTP.");
			}

			if (!isOtpNotExpired) {
				return sendErrorResponse(res, 400, "OTP has expired.");
			}

			if (isOtpValid && isOtpNotExpired) {
				await Auth.verifyUser(req.body.email);

				const token = jwt.sign(
					{
						user_id: user.id,
						email: user.email,
						signedAt: new Date().toISOString(),
					},
					process.env.JWT_SECRET,
					{ expiresIn: "24h" }
				);

				return sendSuccessResponse(res, 200, "OTP verified successfully.", {
					token,
					email: user.email,
					message: "User has been successfully verified.",
				});
			}
		} catch (error) {
			return sendErrorResponse(res, 400, "Error verifying OTP.", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

exports.resendOtp = [
	body("email")
		.isEmail()
		.withMessage("Email must be a valid email address")
		.isLength({ max: 100 })
		.withMessage("Email must be less than 100 characters"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		try {
			const newUser = await Auth.findUserByEmail(req.body.email);

			if (!newUser) {
				return sendErrorResponse(res, 400, "User not found.", [
					"The email does not exist in our records.",
				]);
			}

			const otpCode = crypto.randomInt(100000, 999999).toString();
			const otpSentAt = new Date();

			await Auth.updateUserOTP(newUser.email, otpCode, otpSentAt);

			try {
				const sendEmail = await sendMail(
					newUser.email,
					"Your OTP Code",
					"otp-token",
					{
						name: newUser.full_name || "User",
						otp_code: otpCode,
						supportLink: "https://support.example.com",
					}
				);

				if (sendEmail) {
					return sendSuccessResponse(res, 200, "OTP sent successfully", {
						user: {
							email: newUser.email,
						},
					});
				}
			} catch (emailError) {
				return sendErrorResponse(res, 400, "Error sending OTP email.", [
					emailError.message || "Internal Server Error",
				]);
			}
		} catch (error) {
			sendErrorResponse(res, 400, "Error processing request.", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

// Forgot password
exports.forgotPassword = [
	body("email")
		.isEmail()
		.withMessage("Email must be a valid email address")
		.isLength({ max: 100 })
		.withMessage("Email must be less than 100 characters"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		try {
			const user = await Auth.findUserByEmail(req.body.email);
			if (!user) {
				return sendErrorResponse(res, 400, "User email not found");
			}

			const otpCode = crypto.randomInt(100000, 999999).toString();
			const otpSentAt = new Date();

			await Auth.updateUserResetOTP(user.email, otpCode, otpSentAt);

			try {
				const sendEmail = await sendMail(
					user.email,
					"Your OTP Code",
					"otp-token",
					{
						name: user.full_name || "User",
						otp_code: otpCode,
						supportLink: "https://support.example.com",
					}
				);

				if (sendEmail) {
					return sendSuccessResponse(res, 200, "OTP sent successfully", {
						user: {
							email: user.email,
						},
					});
				}
			} catch (emailError) {
				return sendErrorResponse(res, 400, "Error sending OTP email.", [
					emailError.message || "Internal Server Error",
				]);
			}
		} catch (error) {
			return sendErrorResponse(
				res,
				400,
				"Error processing the password reset request.",
				[error.message || "Internal Server Error"]
			);
		}
	},
];

exports.verifyResetOtp = [
	body("email")
		.isEmail()
		.withMessage("Email must be a valid email address")
		.isLength({ max: 100 })
		.withMessage("Email must be less than 100 characters"),

	body("reset_otp_code").notEmpty().withMessage("OTP is required"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		try {
			const user = await Auth.findUserByEmail(req.body.email);
			if (!user) {
				return sendErrorResponse(res, 400, "User email not found.");
			}

			const isOtpValid = user.reset_otp_code === req.body.reset_otp_code;
			const otpExpiryDuration = 180000;
			const isOtpNotExpired =
				new Date() - new Date(user.reset_otp_sent_at) <= otpExpiryDuration;

			if (!isOtpValid) {
				return sendErrorResponse(res, 400, "Invalid OTP.");
			}

			if (!isOtpNotExpired) {
				return sendErrorResponse(res, 400, "OTP has expired.");
			}

			const token = crypto.randomBytes(32).toString("hex");
			const resetTokenExpiresAt = new Date(Date.now() + otpExpiryDuration);

			await Auth.updateResetToken(user.email, token, resetTokenExpiresAt);

			return sendSuccessResponse(res, 200, "OTP verified successfully.", {
				email: user.email,
				reset_token: token,
				message:
					"Password reset token generated. Please use it to reset your password.",
			});
		} catch (error) {
			return sendErrorResponse(res, 400, "Error verifying OTP.", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

// Reset Password
exports.userResetPassword = [
	body("token").notEmpty().withMessage("Token is required"),

	body("password")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long"),

	body("confirm_password")
		.isLength({ min: 8 })
		.withMessage("Confirm password must be at least 8 characters long")
		.custom((value, { req }) => value === req.body.password)
		.withMessage("Passwords do not match"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		const { token, password } = req.body;
		try {
			const user = await Auth.findUserByResetToken(token);
			if (!user) {
				return sendErrorResponse(res, 400, "Invalid reset token");
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			await Auth.updatePassword(user.id, hashedPassword);
			await Auth.clearResetToken(user.id);

			await sendMail(
				user.email,
				"Password Reset Successfully",
				"user-reset-password",
				{
					name: user.full_name || "User",
				}
			);

			sendSuccessResponse(res, 200, "Password reset successfully.");
		} catch (error) {
			sendErrorResponse(res, 400, "Error resetting password.", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

// Change Password
exports.changePassword = [
	body("email")
		.isEmail()
		.withMessage("Email must be a valid email address")
		.isLength({ max: 100 })
		.withMessage("Email must be less than 100 characters"),

	body("old_password").notEmpty().withMessage("Old password is required"),

	body("new_password")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long"),

	body("confirm_password")
		.isLength({ min: 8 })
		.withMessage("Confirm password must be at least 8 characters long")
		.custom((value, { req }) => value === req.body.new_password)
		.withMessage("Passwords do not match"),

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return sendErrorResponse(
				res,
				400,
				"Validation failed.",
				errors.array().map((err) => ({
					field: err.param,
					message: err.msg,
				}))
			);
		}

		const { old_password, new_password } = req.body;
		try {
			const user = await Auth.findUserByEmail(req.user.email);
			if (!user) {
				return sendErrorResponse(res, 400, "User not found");
			}

			const result = await bcrypt.compare(old_password, user.password);
			if (!result) {
				return sendErrorResponse(res, 400, "Invalid old password");
			}

			if (old_password == new_password) {
				return sendErrorResponse(
					res,
					400,
					"New password cannot be the same as old password"
				);
			}

			const hashedPassword = await bcrypt.hash(new_password, 10);
			await Auth.updatePassword(user.id, hashedPassword);

			sendSuccessResponse(res, 200, "Password change successfully.");
		} catch (error) {
			sendErrorResponse(res, 400, "Error changeing password.", [
				error.message || "Internal Server Error",
			]);
		}
	},
];

exports.checkPasscode = [
	async (req, res) => {
		try {
			const userProfile = await Auth.findUserByEmail(req.user.email);

			if (!userProfile) {
				return sendErrorResponse(res, 400, "User not found");
			}

			if (userProfile && userProfile.passcode === null) {
				return sendSuccessResponse(res, 200, "User fetched successfully", {
					passcode: 0,
				});
			}

			if (userProfile && userProfile.passcode !== null) {
				return sendSuccessResponse(res, 200, "User fetched successfully", {
					passcode: 1,
				});
			}
		} catch (error) {
			return sendErrorResponse(res, 400, "Error fetching user profile", [
				error.message,
			]);
		}
	},
];

exports.logout = [
	async (req, res) => {
		try {
			await Auth.updateUserFCMToken(req.user.user_id, null);

			return sendSuccessResponse(res, 200, "Logout successfully");
		} catch (error) {
			return sendErrorResponse(res, 400, "Error logging out", [error.message]);
		}
	},
];
