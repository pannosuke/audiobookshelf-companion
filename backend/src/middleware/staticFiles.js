const express = require('express');
const path = require('path');

/**
 * Serve static files (React build) in production
 */
const serveStatic = (app) => {
  if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../../public');
    
    // Serve static files
    app.use(express.static(buildPath));
    
    // Handle React Router - send all requests to index.html
    app.get('*', (req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
        return;
      }
      
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  }
};

module.exports = serveStatic;