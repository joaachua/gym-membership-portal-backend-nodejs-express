/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.table("users", function (table) {
		table.string("reset_otp_code").nullable().after('otp_sent_at');
		table.datetime("reset_otp_sent_at").nullable().after('reset_otp_code');
		table.string("fcm_token").nullable().after('is_verified');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.table("users", function (table) {
		table.dropColumn("reset_otp_code");
		table.dropColumn("reset_otp_sent_at");
		table.dropColumn("fcm_token");
	});
};
