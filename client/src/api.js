import axios from 'axios';
import { getToken, clearAuth } from './utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err?.response?.status === 401) {
            // Token invalid/expired; keep UI predictable
            clearAuth();
        }
        return Promise.reject(err);
    }
);

export default api;
