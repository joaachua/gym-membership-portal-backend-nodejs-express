exports.up = async function (knex) {
	await knex.schema.alterTable("users", function (table) {
		table.string("id_no").nullable().alter();
	});
};

exports.down = async function (knex) {
	await knex.schema.alterTable("users", function (table) {
		table.string("id_no").notNullable().alter();
	});
};
