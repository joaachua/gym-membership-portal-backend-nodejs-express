/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("membership_benefits_relation", function (table) {
        table.increments("id").primary();
        table.integer("membership_id").unsigned().notNullable();
        table.integer("benefit_id").unsigned().notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("membership_benefits_relation");
};