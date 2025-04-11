/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("membership_benefits", function (table) {
		table.increments("id").primary();
		table.string("benefit_name").notNullable();
		table.text("benefit_description").nullable();
		table.boolean("active").defaultTo(true);
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