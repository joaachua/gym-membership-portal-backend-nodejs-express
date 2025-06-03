exports.up = function (knex) {
	return knex.schema.createTable("achievements", function (table) {
		table.increments("id").primary();
		table.string("title").notNullable();
		table.text("description").notNullable();
		table.string("icon"); // Optional
		table.string("type").notNullable(); // e.g., workout, streak, goal
		table.integer("target_value").notNullable(); // e.g., 10 workouts

		table.timestamps(true, true); // created_at, updated_at
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("achievements");
};
