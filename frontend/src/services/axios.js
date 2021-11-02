import axios from '../helper/axios';

export const axiosCall = (url, method, data) => {
    debugger
    return axios({ method, url, data })
};
