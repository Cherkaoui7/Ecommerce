import axios from 'axios';

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Accept': 'application/json',
    },
});

httpClient.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser set multipart boundaries for file uploads.
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

export default httpClient;
