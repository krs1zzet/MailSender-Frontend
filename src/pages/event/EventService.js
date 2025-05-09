// EventService.js - örnek servis sınıfı
import axios from 'axios';
import API_CONFIG from '../../config/api';

const EventService = {
  // Kullanıcının kendi etkinliklerini getir
  getUserEvents: async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get(API_CONFIG.getUrl('events/user-events'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  },
  
  // Etkinlik oluştur
  createEvent: async (eventData) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(API_CONFIG.getUrl('events'), eventData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },
  
  // Diğer event-related metotlar...
};

export default EventService;