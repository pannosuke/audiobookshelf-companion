import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';

function SettingsPage() {
  return (
    <>
      <Helmet>
        <title>Settings - AudioBookShelf Companion</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1">
            Application settings and configuration will be available here.
          </Typography>
        </Paper>
      </Container>
    </>
  );
}

export default SettingsPage;