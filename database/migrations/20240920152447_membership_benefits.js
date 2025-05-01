/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("membership_benefits", function (table) {
		table.increments("id").primary();
		table.integer("membership_id").notNullable();
		table.string("benefit_name").notNullable();
		table.text("benefit_description").nullable();
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable("membership_benefits");
};