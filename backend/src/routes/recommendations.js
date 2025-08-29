const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandlers');
const db = require('../database/connection');

/**
 * GET /api/recommendations
 * Get book recommendations
 */
router.get('/', asyncHandler(async (req, res) => {
  const { limit = 10, source, exclude_dismissed = true } = req.query;

  let query = db('recommendations')
    .join('books', 'recommendations.book_id', 'books.id')
    .join('authors', 'books.author_id', 'authors.id')
    .leftJoin('user_books', 'books.id', 'user_books.book_id')
    .select(
      'recommendations.*',
      'books.title',
      'books.cover_image_path',
      'books.description',
      'authors.name as author_name',
      'user_books.rating as user_rating',
      'user_books.reading_status'
    )
    .whereNull('user_books.id') // Only recommend unrated books
    .orderBy('recommendations.confidence_score', 'desc')
    .orderBy('recommendations.recommended_at', 'desc');

  if (source) {
    query = query.where('recommendations.source', source);
  }

  if (exclude_dismissed === 'true') {
    query = query.where('recommendations.is_dismissed', false);
  }

  const recommendations = await query.limit(parseInt(limit));

  res.json({
    success: true,
    data: recommendations
  });
}));

/**
 * POST /api/recommendations/:id/dismiss
 * Dismiss a recommendation
 */
router.post('/:id/dismiss', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updated = await db('recommendations')
    .where('id', id)
    .update({
      is_dismissed: true,
      updated_at: new Date()
    });

  if (updated === 0) {
    return res.status(404).json({
      success: false,
      error: 'Recommendation not found'
    });
  }

  res.json({
    success: true,
    message: 'Recommendation dismissed'
  });
}));

/**
 * POST /api/recommendations/generate
 * Generate new recommendations
 */
router.post('/generate', asyncHandler(async (req, res) => {
  // This is a placeholder for the recommendation engine
  // In a real implementation, this would:
  // 1. Analyze user reading patterns
  // 2. Use AI to generate recommendations
  // 3. Query Goodreads for similar books
  // 4. Store recommendations in the database

  res.json({
    success: true,
    message: 'Recommendation generation started',
    note: 'This feature is under development'
  });
}));

/**
 * GET /api/recommendations/stats
 * Get recommendation statistics
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const [
    totalRecs,
    dismissedRecs,
    sourceBreakdown
  ] = await Promise.all([
    db('recommendations').count('id as count').first(),
    db('recommendations').where('is_dismissed', true).count('id as count').first(),
    db('recommendations')
      .select('source')
      .count('id as count')
      .groupBy('source')
  ]);

  res.json({
    success: true,
    data: {
      total: totalRecs.count,
      dismissed: dismissedRecs.count,
      active: totalRecs.count - dismissedRecs.count,
      bySource: sourceBreakdown.reduce((acc, item) => {
        acc[item.source] = item.count;
        return acc;
      }, {})
    }
  });
}));

module.exports = router;