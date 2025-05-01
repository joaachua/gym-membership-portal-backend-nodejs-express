exports.up = function (knex) {
	return knex.schema.createTable("class_schedules", (table) => {
		table.increments("id").primary();
		table.integer("class_id");
		table.string("day_of_week").notNullable(); // e.g., 'Monday', 'Tuesday'
		table.time("start_time").notNullable();
		table.time("end_time").notNullable();
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("class_schedules");
};
