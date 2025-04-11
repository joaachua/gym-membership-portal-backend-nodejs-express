/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('permissions', (table) => {
        table.increments('id').primary();
        table.string('permission_group').notNullable();
        table.string('permission_name').notNullable();
        table.unique(['permission_group', 'permission_name']);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('permissions');
};