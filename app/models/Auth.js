const bcrypt = require("bcryptjs");
const knex = require("../../config/db");

const Auth = {
	findUserById: async (id) => {
		return  knex("users").where({ id }).first();
	},	

	findUserByEmail: async (email) => {
		return knex("users").where({ email }).first();
	},
	
	findAdminByUsername: async (username) => {
        return knex('users').where({ username }).first();
    },

	updateUserOTP: async (email, otp_code, otpSentAt) => {
		try {
			const updated = await knex("users")
				.where({ email })
				.update({ otp_code, otp_sent_at: otpSentAt });

			if (!updated) throw new Error("Failed to update OTP");
			return updated;
		} catch (error) {
			throw error;
		}
	},

	updateUserResetOTP: async (email, otp_code, otpSentAt) => {
		return knex("users")
			.where({ email })
			.update({ reset_otp_code: otp_code, reset_otp_sent_at: otpSentAt });
	},

	verifyUser: async (email) => {
		return knex("users").where({ email }).update({ is_verified: true });
	},

	updateUserProfile: async (id, data) => {
		const { salutation, username, full_name, role, email, phone_number, password } = data;

		const trx = await knex.transaction();

		try {
			const [userId] = await trx("users").where({ id }).update({
				salutation,
				username, 
				full_name, 
				role, 
				email, 
				phone_number,
				password
			});

			await trx.commit();
			return userId;
		} catch (error) {
			await trx.rollback();
			throw error;
		}
	},

	updatePassword: async (id, password) => {
		try {
			const updated = await knex("users")
				.where({ id })
				.update({ password });

			if (!updated) throw new Error("Failed to update password");
			return updated;
		} catch (error) {
			throw error;
		}
	},

	updateResetToken: async (email, token, expiresAt) => {
		try {
			const updated = await knex("users").where({ email }).update({
				reset_token: token,
				reset_token_expires_at: expiresAt,
			});

			if (!updated) throw new Error("Failed to update reset token");
			return updated;
		} catch (error) {
			throw error;
		}
	},

	updateUserFCMToken: async (userId, fcmToken) => {
		return knex("users").where({ id: userId }).update({ fcm_token: fcmToken });
	},

	clearResetToken: async (id) => {
		try {
			const clearToken = await knex("users").where({ id }).update({
				reset_token: null,
				reset_token_expires_at: null,
			});

			return clearToken;
		} catch (error) {
			throw error;
		}
	},

	registerUser: async (data) => {
		const {
			salutation,
			username,
			full_name,
			phone_number,
			email,
			password,
			role,
			platform,
		} = data;

		const trx = await knex.transaction();

		try {
			if (role) {
				const roles = await trx("roles").where({ id: role }).first();
				if (!roles) {
					await trx.rollback();
					throw new Error("Invalid role specified");
				}
			}

			const [userId] = await trx("users").insert({
				salutation,
				full_name,
				username,
				phone_number,
				email,
				password,
				role,
				platform,
			});

			await trx.commit();
			return userId;
		} catch (error) {
			await trx.rollback();
			throw error;
		}
	},

	findPermissionsByEmail: async (email) => {
		return knex("users")
			.select("permissions.permission_group", "permissions.permission_name")
			.join("roles", "users.role", "=", "roles.id")
			.join("role_permissions", "roles.id", "=", "role_permissions.role_id")
			.join("permissions", "role_permissions.permission_id", "=", "permissions.id")
			.where("users.email", email);
	},

	findAdminByResetToken: async (token) => {
        return knex('users')
            .where({ reset_token: token })
            .andWhere('reset_token_expires_at', '>', new Date())
            .first();
    },
	
	findUserByResetToken: async (token) => {
        return knex('users')
            .where({ reset_token: token })
            .andWhere('reset_token_expires_at', '>', new Date())
            .first();
    },
};

module.exports = Auth;