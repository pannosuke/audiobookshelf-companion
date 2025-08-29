import React from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography
} from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: '#fff3e0'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We're sorry, but something unexpected happened. This error has been logged 
            and we'll look into it.
          </Typography>
        </Box>

        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ 
            textAlign: 'left', 
            backgroundColor: '#f5f5f5', 
            p: 2, 
            borderRadius: 1,
            mb: 3,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            overflow: 'auto'
          }}>
            <Typography variant="h6" gutterBottom>
              Error Details (Development):
            </Typography>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {error.message}
              {error.stack}
            </pre>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={resetErrorBoundary}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ErrorFallback;