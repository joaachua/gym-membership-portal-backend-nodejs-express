/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("subscriptions", function (table) {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
        table.integer("membership_id").unsigned().notNullable().references("id").inTable("memberships").onDelete("CASCADE");
        table.integer("status").notNullable().defaultTo(0); // 0 = pending, 1 = active, 2 = cancelled, 3 = expired
        table.timestamp("start_date").defaultTo(knex.fn.now());
        table.timestamp("end_date").nullable();
        table.boolean("is_auto_renew").defaultTo(false);
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