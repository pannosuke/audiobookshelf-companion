const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandlers');
const db = require('../database/connection');

/**
 * GET /api/books
 * Get books with pagination and filtering
 */
router.get('/', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 24,
    search,
    author,
    genre,
    rating_min,
    rating_max,
    status,
    sort = 'title',
    order = 'asc'
  } = req.query;

  const offset = (page - 1) * limit;
  
  let query = db('books')
    .join('authors', 'books.author_id', 'authors.id')
    .leftJoin('user_books', 'books.id', 'user_books.book_id')
    .select(
      'books.*',
      'authors.name as author_name',
      'user_books.rating',
      'user_books.reading_status',
      'user_books.is_favorite',
      'user_books.progress_percentage'
    );

  // Apply filters
  if (search) {
    query = query.where(function() {
      this.where('books.title', 'like', `%${search}%`)
          .orWhere('authors.name', 'like', `%${search}%`)
          .orWhere('books.description', 'like', `%${search}%`);
    });
  }

  if (author) {
    query = query.where('authors.name', 'like', `%${author}%`);
  }

  if (genre) {
    query = query.whereExists(function() {
      this.select('*')
          .from('book_genres')
          .join('genres', 'book_genres.genre_id', 'genres.id')
          .whereRaw('book_genres.book_id = books.id')
          .where('genres.name', 'like', `%${genre}%`);
    });
  }

  if (rating_min) {
    query = query.where('user_books.rating', '>=', rating_min);
  }

  if (rating_max) {
    query = query.where('user_books.rating', '<=', rating_max);
  }

  if (status) {
    query = query.where('user_books.reading_status', status);
  }

  // Apply sorting
  const validSorts = ['title', 'author_name', 'rating', 'created_at', 'published_date'];
  const validOrders = ['asc', 'desc'];
  
  if (validSorts.includes(sort) && validOrders.includes(order)) {
    if (sort === 'author_name') {
      query = query.orderBy('authors.name', order);
    } else {
      query = query.orderBy(`books.${sort}`, order);
    }
  }

  // Get total count for pagination
  const countQuery = query.clone().clearSelect().clearOrder().count('books.id as count').first();
  
  // Apply pagination
  query = query.limit(limit).offset(offset);

  const [books, { count: total }] = await Promise.all([
    query,
    countQuery
  ]);

  res.json({
    success: true,
    data: {
      books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

/**
 * GET /api/books/:id
 * Get single book by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await db('books')
    .join('authors', 'books.author_id', 'authors.id')
    .leftJoin('user_books', 'books.id', 'user_books.book_id')
    .select(
      'books.*',
      'authors.name as author_name',
      'user_books.rating',
      'user_books.review',
      'user_books.reading_status',
      'user_books.is_favorite',
      'user_books.progress_percentage',
      'user_books.started_reading',
      'user_books.finished_reading',
      'user_books.times_listened'
    )
    .where('books.id', id)
    .first();

  if (!book) {
    return res.status(404).json({
      success: false,
      error: 'Book not found'
    });
  }

  // Get genres
  const genres = await db('book_genres')
    .join('genres', 'book_genres.genre_id', 'genres.id')
    .select('genres.name', 'genres.id')
    .where('book_genres.book_id', id);

  book.genres = genres;

  res.json({
    success: true,
    data: book
  });
}));

/**
 * GET /api/books/author/:authorId
 * Get books by author
 */
router.get('/author/:authorId', asyncHandler(async (req, res) => {
  const { authorId } = req.params;

  const books = await db('books')
    .join('authors', 'books.author_id', 'authors.id')
    .leftJoin('user_books', 'books.id', 'user_books.book_id')
    .select(
      'books.*',
      'authors.name as author_name',
      'user_books.rating',
      'user_books.reading_status',
      'user_books.is_favorite'
    )
    .where('authors.id', authorId)
    .orderBy('books.series_sequence', 'asc')
    .orderBy('books.published_date', 'asc');

  res.json({
    success: true,
    data: books
  });
}));

module.exports = router;