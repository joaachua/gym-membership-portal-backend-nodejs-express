/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("advertisements", function (table) {
		table.increments("id").primary();
		table.string("title").notNullable();
		table.text("description").nullable();
		table.string("image").nullable();
		table.integer("type").notNullable(); // 1 = classes, 2 = membership_plan, 3 = url
		table.string("redirect_link").nullable();
		table.integer("sequence").notNullable().defaultTo(1); // Determines order of display
		table.integer("status").notNullable().defaultTo(0); // 0 = inactive, 1 = active
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable("advertisements");
};