exports.up = function (knex) {
	return knex.schema.createTable("contents", (table) => {
		table.increments("id").primary();
		table.string("title").notNullable();
		table.text("content").notNullable();
		table.integer("status").defaultTo(0); // 0 = inactive 1 = active
		table.timestamps(true, true); // created_at and updated_at
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("contents");
};
