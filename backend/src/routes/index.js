const express = require('express');
const router = express.Router();

// Import route modules
const booksRoutes = require('./books');
const libraryRoutes = require('./library');
const ratingsRoutes = require('./ratings');
const recommendationsRoutes = require('./recommendations');

// API Documentation route
router.get('/', (req, res) => {
  res.json({
    name: 'AudioBookShelf Companion API',
    version: process.env.APP_VERSION || '0.1.0',
    description: 'REST API for AudioBookShelf Companion',
    endpoints: {
      books: '/api/books',
      library: '/api/library',
      ratings: '/api/ratings', 
      recommendations: '/api/recommendations',
      health: '/health'
    },
    documentation: 'https://github.com/pannosuke/audiobookshelf-companion',
    timestamp: new Date().toISOString()
  });
});

// Mount route modules
router.use('/books', booksRoutes);
router.use('/library', libraryRoutes);
router.use('/ratings', ratingsRoutes);
router.use('/recommendations', recommendationsRoutes);

module.exports = router;