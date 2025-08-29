const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandlers');
const libraryScanner = require('../services/libraryScanner');
const db = require('../database/connection');

/**
 * GET /api/library/scan/status
 * Get current scan status
 */
router.get('/scan/status', asyncHandler(async (req, res) => {
  const status = libraryScanner.getScanStatus();
  
  // Get latest scan history
  const latestScan = await db('scan_history')
    .orderBy('started_at', 'desc')
    .first();

  res.json({
    success: true,
    data: {
      ...status,
      latestScan
    }
  });
}));

/**
 * POST /api/library/scan
 * Start a library scan
 */
router.post('/scan', asyncHandler(async (req, res) => {
  const { type = 'manual' } = req.body;
  
  if (!['manual', 'full', 'incremental'].includes(type)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid scan type. Must be: manual, full, or incremental'
    });
  }

  // Check if library path is valid
  const isValidPath = await libraryScanner.validateLibraryPath();
  if (!isValidPath) {
    return res.status(400).json({
      success: false,
      error: 'Library path is not accessible. Please check your configuration.'
    });
  }

  // Start the scan (non-blocking)
  libraryScanner.scanLibrary(type)
    .then(results => {
      console.log('Scan completed:', results);
    })
    .catch(error => {
      console.error('Scan failed:', error);
    });

  res.json({
    success: true,
    message: 'Library scan started',
    data: {
      scanType: type,
      status: 'started'
    }
  });
}));

/**
 * GET /api/library/scan/history
 * Get scan history
 */
router.get('/scan/history', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const scans = await db('scan_history')
    .orderBy('started_at', 'desc')
    .limit(limit)
    .offset(offset);

  const total = await db('scan_history').count('id as count').first();

  res.json({
    success: true,
    data: {
      scans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / limit)
      }
    }
  });
}));

/**
 * GET /api/library/stats
 * Get library statistics
 */
router.get('/stats', asyncHandler(async (req, res) => {
  // Get basic counts
  const [
    bookCount,
    authorCount,
    genreCount,
    ratedCount
  ] = await Promise.all([
    db('books').count('id as count').first(),
    db('authors').count('id as count').first(),
    db('genres').count('id as count').first(),
    db('user_books').whereNotNull('rating').count('id as count').first()
  ]);

  // Get reading status breakdown
  const readingStatusStats = await db('user_books')
    .select('reading_status')
    .count('id as count')
    .groupBy('reading_status');

  // Get recent activity
  const recentlyAdded = await db('books')
    .orderBy('created_at', 'desc')
    .limit(5)
    .select('id', 'title', 'created_at');

  // Get top genres
  const topGenres = await db('book_genres')
    .join('genres', 'book_genres.genre_id', 'genres.id')
    .select('genres.name')
    .count('book_genres.id as count')
    .groupBy('genres.id', 'genres.name')
    .orderBy('count', 'desc')
    .limit(10);

  res.json({
    success: true,
    data: {
      counts: {
        books: bookCount.count,
        authors: authorCount.count,
        genres: genreCount.count,
        rated: ratedCount.count
      },
      readingStatus: readingStatusStats.reduce((acc, item) => {
        acc[item.reading_status] = item.count;
        return acc;
      }, {}),
      recentlyAdded,
      topGenres
    }
  });
}));

/**
 * GET /api/library/validate
 * Validate library path and connectivity
 */
router.get('/validate', asyncHandler(async (req, res) => {
  const isValid = await libraryScanner.validateLibraryPath();
  
  const result = {
    success: true,
    data: {
      isValid,
      path: process.env.AUDIOBOOKSHELF_LIBRARY_PATH,
      timestamp: new Date().toISOString()
    }
  };

  if (!isValid) {
    result.data.error = 'Library path is not accessible or does not exist';
  }

  res.json(result);
}));

module.exports = router;