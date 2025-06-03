exports.up = function (knex) {
	return knex.schema.createTable("user_classes", function (table) {
		table.increments("id").primary();
		table.integer("user_id").unsigned().notNullable();
		table.integer("class_id").unsigned().notNullable();
		table.integer("status").defaultTo(0);
		table.timestamp("created_at").defaultTo(knex.fn.now());
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("user_classes");
};
