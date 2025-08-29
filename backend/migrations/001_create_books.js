/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // Authors table
    .createTable('authors', table => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.text('description');
      table.string('image_url');
      table.string('goodreads_id');
      table.timestamps(true, true);
    })
    
    // Books table
    .createTable('books', table => {
      table.increments('id').primary();
      table.string('audiobookshelf_id').unique(); // Reference to AudioBookShelf metadata
      table.string('title').notNullable();
      table.string('subtitle');
      table.integer('author_id').unsigned().references('id').inTable('authors').onDelete('CASCADE');
      table.text('description');
      table.string('isbn');
      table.string('asin');
      table.string('language').defaultTo('en');
      table.string('publisher');
      table.date('published_date');
      table.integer('duration_seconds'); // Total audiobook duration
      table.string('format'); // m4b, mp3, etc.
      table.string('cover_image_path');
      table.string('file_path'); // Path to the audiobook file
      table.string('goodreads_id');
      table.decimal('goodreads_rating', 3, 2); // e.g., 4.25
      table.integer('goodreads_rating_count');
      table.boolean('is_series').defaultTo(false);
      table.string('series_name');
      table.integer('series_sequence');
      table.timestamp('last_scanned').defaultTo(knex.fn.now());
      table.timestamps(true, true);
      
      // Indexes for performance
      table.index('title');
      table.index('author_id');
      table.index('goodreads_id');
      table.index('audiobookshelf_id');
    })
    
    // Genres table
    .createTable('genres', table => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.timestamps(true, true);
    })
    
    // Book-Genre many-to-many relationship
    .createTable('book_genres', table => {
      table.increments('id').primary();
      table.integer('book_id').unsigned().references('id').inTable('books').onDelete('CASCADE');
      table.integer('genre_id').unsigned().references('id').inTable('genres').onDelete('CASCADE');
      table.timestamps(true, true);
      
      // Ensure unique combinations
      table.unique(['book_id', 'genre_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('book_genres')
    .dropTableIfExists('genres')
    .dropTableIfExists('books')
    .dropTableIfExists('authors');
};