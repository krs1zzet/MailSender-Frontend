// Configuration for API endpoints
const API_CONFIG = {
  // Base URL for API calls - use different URLs for development vs production
  baseUrl: process.env.NODE_ENV === 'development' 
    ? (process.env.REACT_APP_API_URL || 'http://localhost:8080')
    : (process.env.REACT_APP_API_URL || 'http://54.172.234.3:8080'),
  
  // Get the full URL for an API endpoint
  getUrl: function(path) {
    // Using the same protocol as the current page to avoid mixed content issues
    let baseUrlWithProtocol = this.baseUrl;
    
    // If URL doesn't start with http, use the current protocol
    if (!baseUrlWithProtocol.startsWith('http')) {
      const protocol = window.location.protocol;
      baseUrlWithProtocol = `${protocol}//${baseUrlWithProtocol}`;
    }
    
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Add /api/ prefix if not already present
    const apiPath = cleanPath.startsWith('api/') ? cleanPath : `api/${cleanPath}`;
    
    console.log(`API call to: ${baseUrlWithProtocol}/${apiPath}`);
    return `${baseUrlWithProtocol}/${apiPath}`;
  }
};

console.log('API Config initialized with baseUrl:', API_CONFIG.baseUrl, 'Environment:', process.env.NODE_ENV);

export default API_CONFIG; 