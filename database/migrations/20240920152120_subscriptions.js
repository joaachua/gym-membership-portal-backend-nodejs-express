/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("subscriptions", function (table) {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
        table.integer("membership_id").unsigned().notNullable().references("id").inTable("memberships").onDelete("CASCADE");
        table.enum("status", ["active", "cancelled", "expired", "pending"]).notNullable().defaultTo("pending");
        table.timestamp("start_date").defaultTo(knex.fn.now());
        table.timestamp("end_date").nullable();
        table.boolean("auto_renew").defaultTo(false);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("subscriptions");
};