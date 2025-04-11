/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("users", function (table) {
		table.increments("id").primary();
		table.string("salutation").nullable();
		table.string("first_name").nullable();
		table.string("last_name").notNullable();
		table.string("username").notNullable().unique();
		table.string("phone_number").notNullable().unique();
		table.string("email").notNullable().unique();
		table.string("password").nullable();
        table.boolean("is_verified").defaultTo(false);
		table.string("role").nullable();
		table.string("platform").nullable();
		table.string("otp_code").nullable();
		table.datetime("otp_sent_at").nullable();
		table.string("reset_token").nullable();
		table.datetime("reset_token_expires_at").nullable();
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable("users");
};