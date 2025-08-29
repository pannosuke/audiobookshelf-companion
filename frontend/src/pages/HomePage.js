import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material';
import {
  LibraryBooks as BooksIcon,
  Storage as LibraryIcon,
  Recommend as RecommendIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function HomePage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Browse Books',
      description: 'Explore your audiobook library',
      icon: <BooksIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/books'),
      color: 'primary.main'
    },
    {
      title: 'Library Management',
      description: 'Scan and manage your library',
      icon: <LibraryIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/library'),
      color: 'secondary.main'
    },
    {
      title: 'Get Recommendations',
      description: 'Discover your next great listen',
      icon: <RecommendIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/recommendations'),
      color: 'success.main'
    },
    {
      title: 'Rate Books',
      description: 'Rate and review your books',
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/books'),
      color: 'warning.main'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - AudioBookShelf Companion</title>
        <meta name="description" content="Your personal audiobook companion dashboard" />
      </Helmet>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to AudioBookShelf Companion
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Your personal audiobook library enhanced with ratings, recommendations, and smart discovery.
          </Typography>
        </Paper>

        {/* Quick Actions Grid */}
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
                onClick={action.action}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ color: action.color, mb: 2 }}>
                    {action.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Getting Started Section */}
        <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Getting Started
          </Typography>
          <Typography variant="body1" paragraph>
            To get the most out of AudioBookShelf Companion:
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1" paragraph>
              Start by scanning your library to import your AudioBookShelf collection
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Rate books you've read to improve recommendations
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Explore AI-powered recommendations for your next great listen
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Organize your books with personal collections and reading lists
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/library')}
            >
              Scan Library Now
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default HomePage;