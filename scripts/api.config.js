// Production API configuration
export const API_CONFIG = {
    BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://college-tracker-api.onrender.com/api/v1'
        : 'http://localhost:5001/api/v1',
    TIMEOUT: 10000,
    FRONTEND_URL: 'https://musical-dragon-a3a076.netlify.app'
};
