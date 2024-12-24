// Production API configuration for College Tracker
export const API_CONFIG = {
    BASE_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:5001/api/v1'
        : 'https://college-tracker-o2bs.onrender.com/api/v1',
    TIMEOUT: 10000,
    FRONTEND_URL: 'https://college-tracker-app.netlify.app'
};
