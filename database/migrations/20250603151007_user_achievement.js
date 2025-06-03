exports.up = function(knex) {
    return knex.schema.createTable('user_achievements', function(table) {
      table.increments('id').primary();
  
      table.integer('user_id').unsigned().notNullable();
      table.integer('achievement_id').unsigned().notNullable();
  
      table.integer('progress').defaultTo(0);
      table.boolean('is_unlocked').defaultTo(false);
      table.timestamp('unlocked_at').nullable();
  
      table.timestamps(true, true);
      // Prevent duplicate entries
      table.unique(['user_id', 'achievement_id']);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_achievements');
  };
  