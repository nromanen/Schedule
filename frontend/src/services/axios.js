import axios from '../helper/axios';

export const axiosCall = (url, method, data, config) =>
    axios({ method, url, data, ...config });
