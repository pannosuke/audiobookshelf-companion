import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';

function RecommendationsPage() {
  return (
    <>
      <Helmet>
        <title>Recommendations - AudioBookShelf Companion</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Book Recommendations
          </Typography>
          <Typography variant="body1">
            AI-powered book recommendations will be displayed here.
          </Typography>
        </Paper>
      </Container>
    </>
  );
}

export default RecommendationsPage;