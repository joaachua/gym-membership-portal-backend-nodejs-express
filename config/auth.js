require("dotenv").config({ path: "../.env" });
const jwt = require("jsonwebtoken");
const knex = require("../config/db");
const { sendErrorResponse } = require("../services/helper");

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token =
		authHeader && authHeader.startsWith("Bearer ")
			? authHeader.split(" ")[1]
			: null;

	if (token == null) return sendErrorResponse("No token provided");

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return sendErrorResponse("Invalid token");

		req.user = user;
		next();
	});
};

const verifyToken = (req, res, next) => {
	const tokenHeader = req.headers["authorization"];

	if (!tokenHeader) {
		return res.status(403).json({
			success: false,
			status_code: 403,
			message: "No token provided",
			data: null,
		});
	}

	const token = tokenHeader.split(" ")[1];

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(500).json({
				success: false,
				status_code: 500,
				message: "Failed to authenticate token",
				data: err,
			});
		}

		req.user = decoded;
		next();
	});
};

const authorize = (requiredPermissions) => {
	return async (req, res, next) => {
		try {
			if (!req.user || !req.user.id) {
				return sendErrorResponse("Unauthorized: User is not authenticated.");
			}

			const userId = req.user.id;
			const userPermissions = await getUserPermissions(userId);

			const hasPermission = requiredPermissions.every((permission) =>
				userPermissions.includes(permission)
			);

			if (!hasPermission) {
				return sendErrorResponse(
					"Access denied: You do not have the necessary permissions to perform this action.",
					["Forbidden"]
				);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};

const getUserPermissions = async (userId) => {
	const permissions = await knex("users")
		.join("roles", "users.role", "roles.id")
		.join("role_permissions", "roles.id", "role_permissions.role_id")
		.join("permissions", "permissions.id", "role_permissions.permission_id")
		.where("users.id", userId)
		.select("permissions.permission_group", "permissions.permission_name");

	return permissions.map((p) => `${p.permission_group}-${p.permission_name}`);
};

module.exports = { authenticateToken, verifyToken, authorize };