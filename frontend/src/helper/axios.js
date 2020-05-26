import axios from 'axios';
import { TOKEN_BEGIN } from '../constants/tokenBegin';

const instance = axios.create({
    baseURL: `/`
});

const token = localStorage.getItem('token');
if (token && token.includes(TOKEN_BEGIN)) {
    instance.defaults.headers.common.Authorization = token;
}

export default instance;