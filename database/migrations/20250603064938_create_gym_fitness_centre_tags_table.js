exports.up = function (knex) {
	return knex.schema.createTable("centre_tags", (table) => {
		table.increments("id").primary();
		table.integer("centre_id");
        table.string("tag_name").nullable();
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("centre_tags");
};
