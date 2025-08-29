/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // App settings and configuration
    .createTable('settings', table => {
      table.increments('id').primary();
      table.string('key').notNullable().unique();
      table.text('value'); // JSON string or plain text
      table.string('type').defaultTo('string'); // string, number, boolean, json
      table.text('description');
      table.timestamps(true, true);
    })
    
    // Library scan history and status
    .createTable('scan_history', table => {
      table.increments('id').primary();
      table.enum('scan_type', ['full', 'incremental', 'manual']).notNullable();
      table.timestamp('started_at').defaultTo(knex.fn.now());
      table.timestamp('completed_at');
      table.enum('status', ['running', 'completed', 'failed', 'cancelled']).defaultTo('running');
      table.integer('books_found').defaultTo(0);
      table.integer('books_added').defaultTo(0);
      table.integer('books_updated').defaultTo(0);
      table.integer('books_removed').defaultTo(0);
      table.text('error_message');
      table.json('scan_results'); // Detailed scan results
      table.timestamps(true, true);
      
      table.index('status');
      table.index('started_at');
    })
    
    // User feedback and feature requests
    .createTable('feedback', table => {
      table.increments('id').primary();
      table.enum('type', ['bug', 'feature_request', 'improvement', 'question']).notNullable();
      table.string('title').notNullable();
      table.text('description').notNullable();
      table.string('user_agent');
      table.string('app_version');
      table.enum('priority', ['low', 'medium', 'high', 'critical']).defaultTo('medium');
      table.enum('status', ['open', 'in_progress', 'resolved', 'closed']).defaultTo('open');
      table.string('github_issue_url'); // Link to created GitHub issue
      table.json('metadata'); // Additional context data
      table.timestamps(true, true);
      
      table.index('type');
      table.index('status');
      table.index('priority');
    })
    
    // Analytics (optional, privacy-focused)
    .createTable('usage_stats', table => {
      table.increments('id').primary();
      table.string('event_type').notNullable(); // page_view, book_rated, search_performed, etc.
      table.string('event_category');
      table.json('event_data'); // Anonymous event data
      table.timestamp('recorded_at').defaultTo(knex.fn.now());
      table.date('date_only'); // For daily aggregation
      
      table.index('event_type');
      table.index('date_only');
      table.index('recorded_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('usage_stats')
    .dropTableIfExists('feedback')
    .dropTableIfExists('scan_history')
    .dropTableIfExists('settings');
};