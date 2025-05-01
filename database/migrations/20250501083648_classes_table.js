exports.up = function (knex) {
	return knex.schema.createTable("classes", (table) => {
		table.increments("id").primary();
		table.string("title").notNullable();
		table.text("description").notNullable();
		table.string("featured_img").nullable();
		table.integer("trainer_id").nullable();
		table.boolean("is_recurring").defaultTo(false);
		table.string("recurrence_pattern").nullable(); // 'daily', 'weekly', 'biweekly'
		table.integer("status").defaultTo(0); // 0 = inactive 1 = active
		table.timestamps(true, true); // created_at and updated_at
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("classes");
};
