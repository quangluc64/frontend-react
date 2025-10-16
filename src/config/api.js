// config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  
  ENDPOINTS: {
    // Plates endpoints
    LATEST_PLATES: "/latest_plates",
    PLATES_HISTORY: "/plates-history",
    UPDATE_PLATE: "/update_plate",
    RELOAD_CACHE: "/reload_cache",
    
    // Employee endpoints
    SEARCH_EMPLOYEE: "/search",
    ADD_EMPLOYEE: "/add_employee",
    
    // Video stream
    VIDEO_STREAM: "/video",
    
    // Stats
    STATS: "/stats",
  },
  
  // Polling intervals (ms)
  POLLING: {
    LATEST_PLATES: 2000,  // 2 seconds
    STATS: 30000,         // 30 seconds
    CAMERA_STATUS: 30000, // 30 seconds
  },
  
  // Cache TTL
  CACHE_TTL: 5000, // 5 seconds
};

// Helper function để build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_CONFIG;