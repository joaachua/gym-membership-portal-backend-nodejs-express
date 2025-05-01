/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("users", function (table) {
		table.increments("id").primary();
		table.string("salutation").nullable();
		table.string("username").notNullable().unique();
		table.string("full_name").notNullable();
		table.string("email").notNullable().unique();
		table.string("phone_number").notNullable().unique();
		table.string("id_no").notNullable().unique();
		table.string("password").nullable();
        table.boolean("is_verified").defaultTo(false);
		table.integer("role").nullable();
		table.integer("platform").nullable();
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