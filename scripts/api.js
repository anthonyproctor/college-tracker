// Import API Configuration
import { API_CONFIG } from './api.config.js';

// API Configuration
const API_URL = API_CONFIG.BASE_URL;

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }
    return data;
};

// Authentication API calls
const auth = {
    async register(userData) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },

    async login(credentials) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        const data = await handleResponse(response);
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('applications');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

// Applications API calls
const applications = {
    async getAll() {
        const response = await fetch(`${API_URL}/applications`, {
            headers: {
                'Authorization': `Bearer ${auth.getToken()}`,
            },
        });
        return handleResponse(response);
    },

    async getById(id) {
        const response = await fetch(`${API_URL}/applications/${id}`, {
            headers: {
                'Authorization': `Bearer ${auth.getToken()}`,
            },
        });
        return handleResponse(response);
    },

    async create(applicationData) {
        const response = await fetch(`${API_URL}/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.getToken()}`,
            },
            body: JSON.stringify(applicationData),
        });
        return handleResponse(response);
    },

    async update(id, applicationData) {
        const response = await fetch(`${API_URL}/applications/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.getToken()}`,
            },
            body: JSON.stringify(applicationData),
        });
        return handleResponse(response);
    },

    async delete(id) {
        const response = await fetch(`${API_URL}/applications/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${auth.getToken()}`,
            },
        });
        return handleResponse(response);
    }
};

export const api = {
    auth,
    applications
};
