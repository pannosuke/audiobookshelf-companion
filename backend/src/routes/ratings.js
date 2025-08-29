const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandlers');
const db = require('../database/connection');

/**
 * POST /api/ratings
 * Add or update a book rating
 */
router.post('/', asyncHandler(async (req, res) => {
  const {
    book_id,
    rating,
    review,
    reading_status = 'want_to_read',
    is_favorite = false
  } = req.body;

  // Validation
  if (!book_id) {
    return res.status(400).json({
      success: false,
      error: 'book_id is required'
    });
  }

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({
      success: false,
      error: 'Rating must be between 1 and 5'
    });
  }

  const validStatuses = ['want_to_read', 'currently_reading', 'completed', 'dnf'];
  if (!validStatuses.includes(reading_status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid reading status'
    });
  }

  // Check if book exists
  const book = await db('books').where('id', book_id).first();
  if (!book) {
    return res.status(404).json({
      success: false,
      error: 'Book not found'
    });
  }

  // Check if rating already exists
  const existingRating = await db('user_books').where('book_id', book_id).first();

  const ratingData = {
    book_id,
    rating: rating || null,
    review: review || null,
    reading_status,
    is_favorite: !!is_favorite,
    updated_at: new Date()
  };

  // Set timestamps based on status
  if (reading_status === 'currently_reading' && !existingRating?.started_reading) {
    ratingData.started_reading = new Date();
  }
  
  if (reading_status === 'completed' && !existingRating?.finished_reading) {
    ratingData.finished_reading = new Date();
    ratingData.progress_percentage = 100;
  }

  let result;
  if (existingRating) {
    // Update existing rating
    await db('user_books').where('book_id', book_id).update(ratingData);
    result = await db('user_books').where('book_id', book_id).first();
  } else {
    // Create new rating
    ratingData.created_at = new Date();
    const [id] = await db('user_books').insert(ratingData);
    result = await db('user_books').where('id', id).first();
  }

  res.json({
    success: true,
    message: existingRating ? 'Rating updated' : 'Rating added',
    data: result
  });
}));

/**
 * GET /api/ratings/:bookId
 * Get rating for a specific book
 */
router.get('/:bookId', asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const rating = await db('user_books')
    .join('books', 'user_books.book_id', 'books.id')
    .join('authors', 'books.author_id', 'authors.id')
    .select(
      'user_books.*',
      'books.title',
      'authors.name as author_name'
    )
    .where('user_books.book_id', bookId)
    .first();

  if (!rating) {
    return res.status(404).json({
      success: false,
      error: 'Rating not found'
    });
  }

  res.json({
    success: true,
    data: rating
  });
}));

/**
 * DELETE /api/ratings/:bookId
 * Delete a book rating
 */
router.delete('/:bookId', asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const deleted = await db('user_books').where('book_id', bookId).del();

  if (deleted === 0) {
    return res.status(404).json({
      success: false,
      error: 'Rating not found'
    });
  }

  res.json({
    success: true,
    message: 'Rating deleted'
  });
}));

/**
 * GET /api/ratings
 * Get all user ratings with pagination
 */
router.get('/', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    rating_min,
    rating_max,
    favorites_only
  } = req.query;

  const offset = (page - 1) * limit;

  let query = db('user_books')
    .join('books', 'user_books.book_id', 'books.id')
    .join('authors', 'books.author_id', 'authors.id')
    .select(
      'user_books.*',
      'books.title',
      'books.cover_image_path',
      'authors.name as author_name'
    );

  // Apply filters
  if (status) {
    query = query.where('user_books.reading_status', status);
  }

  if (rating_min) {
    query = query.where('user_books.rating', '>=', rating_min);
  }

  if (rating_max) {
    query = query.where('user_books.rating', '<=', rating_max);
  }

  if (favorites_only === 'true') {
    query = query.where('user_books.is_favorite', true);
  }

  // Get total count
  const countQuery = query.clone().clearSelect().count('user_books.id as count').first();

  // Apply pagination and ordering
  query = query
    .orderBy('user_books.updated_at', 'desc')
    .limit(limit)
    .offset(offset);

  const [ratings, { count: total }] = await Promise.all([
    query,
    countQuery
  ]);

  res.json({
    success: true,
    data: {
      ratings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

module.exports = router;