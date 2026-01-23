import axios from 'axios';
import { TOKEN_BEGIN } from '../constants/tokenBegin';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && token.includes(TOKEN_BEGIN)) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        const newToken = response.headers['x-new-token'];
        if (newToken) {
            localStorage.setItem('token', `${TOKEN_BEGIN}${newToken}`);
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;