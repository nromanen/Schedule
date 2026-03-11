import axios from '../helper/axios';
import { SET_PASSWORD_URL } from '../constants/axios';

export const setPassword = ({ token, password }) =>
    axios.put(SET_PASSWORD_URL, { token, password }).then(res => res.data);