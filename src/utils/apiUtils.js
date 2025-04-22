import API_CONFIG from '../config/api';

/**
 * Utility functions for making API calls
 */
const apiUtils = {
  /**
   * Make a fetch request to the API
   * 
   * @param {string} endpoint - API endpoint path (without base URL)
   * @param {Object} options - Fetch options
   * @returns {Promise} - Fetch response promise
   */
  fetchApi: async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    console.log(`API call to endpoint: ${endpoint}`);
    
    // Default headers
    const defaultHeaders = {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Merge default headers with any provided headers
    const headers = {
      ...defaultHeaders,
      ...(options.headers || {})
    };
    
    // Skip Content-Type for file uploads
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }
    
    // Build fetch options
    const fetchOptions = {
      mode: 'cors',
      ...options,
      headers
    };
    
    // Get the full URL
    const url = API_CONFIG.getUrl(endpoint);
    
    // Make the request
    try {
      console.log(`Fetching ${url}`);
      const response = await fetch(url, fetchOptions);
      
      if (response.status === 0) {
        throw new Error('Network error - CORS issue or server unavailable');
      }
      
      return response;
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  }
};

export default apiUtils; 