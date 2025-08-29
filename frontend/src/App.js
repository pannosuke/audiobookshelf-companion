import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Box } from '@mui/material';

// Layout components
import Layout from './components/Layout/Layout';
import ErrorFallback from './components/ErrorBoundary/ErrorFallback';

// Page components
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import LibraryPage from './pages/LibraryPage';
import RecommendationsPage from './pages/RecommendationsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </Box>
    </ErrorBoundary>
  );
}

export default App;