/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // Personal ratings and reading status
    .createTable('user_books', table => {
      table.increments('id').primary();
      table.integer('book_id').unsigned().references('id').inTable('books').onDelete('CASCADE');
      table.decimal('rating', 2, 1); // 1.0 to 5.0 stars
      table.text('review'); // Personal review/notes
      table.enum('reading_status', ['want_to_read', 'currently_reading', 'completed', 'dnf']).defaultTo('want_to_read');
      table.integer('progress_seconds').defaultTo(0); // Reading progress in seconds
      table.decimal('progress_percentage', 5, 2).defaultTo(0); // Progress as percentage
      table.timestamp('started_reading');
      table.timestamp('finished_reading');
      table.timestamp('last_opened');
      table.boolean('is_favorite').defaultTo(false);
      table.integer('times_listened').defaultTo(0);
      table.timestamps(true, true);
      
      // Each book can only have one user rating (single-user system for now)
      table.unique(['book_id']);
      table.index('rating');
      table.index('reading_status');
      table.index('is_favorite');
    })
    
    // Reading lists/collections
    .createTable('reading_lists', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.boolean('is_public').defaultTo(false);
      table.timestamps(true, true);
    })
    
    // Books in reading lists
    .createTable('reading_list_books', table => {
      table.increments('id').primary();
      table.integer('reading_list_id').unsigned().references('id').inTable('reading_lists').onDelete('CASCADE');
      table.integer('book_id').unsigned().references('id').inTable('books').onDelete('CASCADE');
      table.integer('sort_order').defaultTo(0);
      table.timestamps(true, true);
      
      table.unique(['reading_list_id', 'book_id']);
    })
    
    // Recommendations table
    .createTable('recommendations', table => {
      table.increments('id').primary();
      table.integer('book_id').unsigned().references('id').inTable('books').onDelete('CASCADE');
      table.enum('source', ['ai', 'goodreads', 'genre', 'author', 'manual']).notNullable();
      table.decimal('confidence_score', 3, 2); // 0.00 to 1.00
      table.text('reason'); // Why this book was recommended
      table.json('metadata'); // Additional recommendation data
      table.boolean('is_dismissed').defaultTo(false);
      table.timestamp('recommended_at').defaultTo(knex.fn.now());
      table.timestamps(true, true);
      
      table.index('book_id');
      table.index('source');
      table.index('confidence_score');
      table.index('recommended_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('recommendations')
    .dropTableIfExists('reading_list_books')
    .dropTableIfExists('reading_lists')
    .dropTableIfExists('user_books');
};