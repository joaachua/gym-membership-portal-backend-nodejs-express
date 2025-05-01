/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("memberships", function (table) {
        table.increments("id").primary();
        table.string("plan_name").notNullable();
        table.integer("plan_type").notNullable(); // 1 = temporary, 2 = trial, 3 = no_contract, 4 = contract
        table.decimal("price", 10, 2).notNullable();
        table.integer("duration_in_days").nullable(); // For temporary/trial plans
        table.integer("duration_in_months").nullable(); // For contract/no-contract plans
        table.boolean("is_auto_debit").defaultTo(false);
        table.boolean("is_cancel_anytime").defaultTo(false);
        table.string("access_level").notNullable(); // Basic, Premium, etc.
        table.text("description").nullable();
        table.timestamps(true, true);
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("memberships");
};