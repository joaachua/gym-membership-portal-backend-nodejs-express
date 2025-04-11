const bcrypt = require("bcryptjs");
const knex = require("../../config/db");
const {
	sendSuccessResponse,
	sendErrorResponse,
} = require("../../services/helper");

const Auth = {
	findUserById: async (id) => {
		try {
			const user = await knex("users").where({ id }).first();
			if (!user) return sendErrorResponse("User not found");
			return sendSuccessResponse("User retrieved", user);
		} catch (error) {
			return sendErrorResponse("Error retrieving user", error);
		}
	},

	findUserByEmail: async (email) => {
		try {
			const user = await knex("users").where({ email }).first();
			if (!user) return sendErrorResponse("User not found");
			return sendSuccessResponse("User retrieved", user);
		} catch (error) {
			return sendErrorResponse("Error retrieving user", error);
		}
	},

	updateUserOTP: async (email, otp_code, otpSentAt) => {
		try {
			const updated = await knex("users")
				.where({ email })
				.update({ otp_code, otp_sent_at: otpSentAt });

			if (updated) return sendSuccessResponse("OTP updated successfully");
			return sendErrorResponse("Failed to update OTP");
		} catch (error) {
			return sendErrorResponse("Error updating OTP", error);
		}
	},

	verifyUser: async (phone_number) => {
		try {
			const updated = await knex("users")
				.where({ phone_number })
				.update({ is_verified: true });

			if (updated) return sendSuccessResponse("User verified successfully");
			return sendErrorResponse("User verification failed");
		} catch (error) {
			return sendErrorResponse("Error verifying user", error);
		}
	},

	updateUserProfile: async (id, data) => {
		const { salutation, first_name, last_name, username, phone_number, email } =
			data;

		const trx = await knex.transaction();

		try {
			const [userId] = await trx("users").where({ id }).update({
				salutation,
				first_name,
				last_name,
				username,
				phone_number,
				email,
			});

			await trx.commit();
			return sendSuccessResponse("User profile updated successfully", { userId });
		} catch (error) {
			await trx.rollback();
			return sendErrorResponse("Error updating user profile", error);
		}
	},

	updatePassword: async (id, password) => {
		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			const updated = await knex("users")
				.where({ id })
				.update({ password: hashedPassword });

			if (updated) return sendSuccessResponse("Password updated successfully");
			return sendErrorResponse("Failed to update password");
		} catch (error) {
			return sendErrorResponse("Error updating password", error);
		}
	},

	updateResetToken: async (email, token, expiresAt) => {
		try {
			const updated = await knex("users").where({ email }).update({
				reset_token: token,
				reset_token_expires_at: expiresAt,
			});

			if (updated)
				return sendSuccessResponse("Reset token updated successfully");
			return sendErrorResponse("Failed to update reset token");
		} catch (error) {
			return sendErrorResponse("Error updating reset token", error);
		}
	},

	clearResetToken: async (id) => {
		try {
			const clearToken = await knex("users").where({ id }).update({
				reset_token: null,
				reset_token_expires_at: null,
			});

			if (clearToken) return sendSuccessResponse("Token cleared successfully");
		} catch (error) {
			return sendErrorResponse("Error updating password", error);
		}
	},

	registerUser: async (data) => {
		const {
			salutation,
			first_name,
			last_name,
			username,
			phone_number,
			email,
			password,
			role,
			platform,
		} = data;

		const trx = await knex.transaction();

		try {
			const roles = await trx("roles").where({ id: role }).first();
			if (!roles) {
				await trx.rollback();
				return sendErrorResponse("Invalid role specified");
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const [userId] = await trx("users").insert({
				salutation,
				first_name,
				last_name,
				username,
				phone_number,
				email,
				password: hashedPassword,
				role,
				platform,
			});

			await trx.commit();
			return sendSuccessResponse("User registered successfully", { userId });
		} catch (error) {
			await trx.rollback();
			return sendErrorResponse("Error registering user", error);
		}
	},
};

module.exports = Auth;