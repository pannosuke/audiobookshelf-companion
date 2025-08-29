import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';

function BookDetailPage() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>Book Details - AudioBookShelf Companion</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Book Details
          </Typography>
          <Typography variant="body1">
            Detailed view for book ID: {id}
          </Typography>
        </Paper>
      </Container>
    </>
  );
}

export default BookDetailPage;