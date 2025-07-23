// Configuration for API endpoints
const API_CONFIG = {
  // Base URL'i doğrudan .env dosyasından al.
  // Eğer .env'de bir şey tanımlı değilse, geliştirme ortamı için localhost'a yönlendir.
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  
  // Belirtilen yola göre tam API URL'ini oluşturan fonksiyon
  getUrl: function(path) {
    // Path'in başındaki ve sonundaki fazlalık '/' karakterlerini temizle
    const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    const fullUrl = `${cleanBaseUrl}/${cleanPath}`;
    
    console.log(`API call to: ${fullUrl}`); // Hata ayıklama için hangi adrese istek yapıldığını gösterir
    return fullUrl;
  }
};

console.log('API Config initialized with baseUrl:', API_CONFIG.baseUrl);

export default API_CONFIG;