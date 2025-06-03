exports.up = function (knex) {
	return knex.schema.createTable("centres", (table) => {
		table.increments("id").primary();
		table.string("name").notNullable();
		table.text("description").notNullable();
		table.string("featured_img").nullable();
		table.string("location").nullable();
		table.timestamps(true, true); // created_at and updated_at
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable("centres");
};
