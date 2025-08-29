import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';

function BooksPage() {
  return (
    <>
      <Helmet>
        <title>Books - AudioBookShelf Companion</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Books
          </Typography>
          <Typography variant="body1">
            Book library functionality will be implemented here.
          </Typography>
        </Paper>
      </Container>
    </>
  );
}

export default BooksPage;