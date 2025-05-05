exports.up = async function (knex) {
	await knex.schema.alterTable("users", function (table) {
		table.string("username").nullable().alter();
	});
};

exports.down = async function (knex) {
	await knex.schema.alterTable("users", function (table) {
		table.string("username").notNullable().alter();
	});
};