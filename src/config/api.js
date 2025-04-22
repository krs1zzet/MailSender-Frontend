// Configuration for API endpoints
const API_CONFIG = {
  // Base URL for API calls
  baseUrl: process.env.REACT_APP_API_URL || 'http://54.172.234.3:8080',
  
  // Get the full URL for an API endpoint
  getUrl: function(path) {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Add /api/ prefix if not already present
    const apiPath = cleanPath.startsWith('api/') ? cleanPath : `api/${cleanPath}`;
    
    return `${this.baseUrl}/${apiPath}`;
  }
};

export default API_CONFIG; 