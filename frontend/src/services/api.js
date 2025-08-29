import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      toast.error('Authentication required');
    } else if (error.response?.status >= 500) {
      toast.error('Server error occurred');
    } else if (error.code === 'NETWORK_ERROR') {
      toast.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const booksAPI = {
  // Get all books with filters
  getBooks: (params = {}) => api.get('/books', { params }),
  
  // Get single book
  getBook: (id) => api.get(`/books/${id}`),
  
  // Get books by author
  getBooksByAuthor: (authorId) => api.get(`/books/author/${authorId}`),
};

export const libraryAPI = {
  // Get library stats
  getStats: () => api.get('/library/stats'),
  
  // Start library scan
  startScan: (type = 'manual') => api.post('/library/scan', { type }),
  
  // Get scan status
  getScanStatus: () => api.get('/library/scan/status'),
  
  // Get scan history
  getScanHistory: (params = {}) => api.get('/library/scan/history', { params }),
  
  // Validate library path
  validateLibrary: () => api.get('/library/validate'),
};

export const ratingsAPI = {
  // Get all ratings
  getRatings: (params = {}) => api.get('/ratings', { params }),
  
  // Get rating for specific book
  getRating: (bookId) => api.get(`/ratings/${bookId}`),
  
  // Add or update rating
  saveRating: (ratingData) => api.post('/ratings', ratingData),
  
  // Delete rating
  deleteRating: (bookId) => api.delete(`/ratings/${bookId}`),
};

export const recommendationsAPI = {
  // Get recommendations
  getRecommendations: (params = {}) => api.get('/recommendations', { params }),
  
  // Dismiss recommendation
  dismissRecommendation: (id) => api.post(`/recommendations/${id}/dismiss`),
  
  // Generate new recommendations
  generateRecommendations: () => api.post('/recommendations/generate'),
  
  // Get recommendation stats
  getStats: () => api.get('/recommendations/stats'),
};

export default api;