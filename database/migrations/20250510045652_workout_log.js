exports.up = function (knex) {
	return knex.schema.createTable("user_workouts", (table) => {
		table.increments("id").primary();
		table.integer("user_id").notNullable();
		table.string("exercise").notNullable();
		table.float("duration").notNullable();
		table.float("weight_kg").notNullable();
		table.date("date").notNullable();
		table.float("calories_burned").notNullable();
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("user_workouts");
};
