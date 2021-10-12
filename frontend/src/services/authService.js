import { has } from 'lodash';
import axios from '../helper/axios';
import {
    ACTIVATE_ACCOUNT_URL,
    LOGIN_URL,
    LOGOUT_URL,
    REGISTRATION_URL,
    RESET_PASSWORD_URL,
} from '../constants/axios';
import { GOOGLE } from '../constants/common';

export const authUserService = (request) => {
    if (has(request.result, 'authType') && request.result.authType === GOOGLE) {
        return { data: { token: request.result.token, email: '' } };
    }
    return axios.post(LOGIN_URL, request.result).then((response) => {
        return response;
    });
};

export const registerUserService = (request) => {
    return axios.post(REGISTRATION_URL, request.result).then((response) => {
        return response;
    });
};

export const resetUserPasswordService = (request) => {
    return axios
        .put(`${RESET_PASSWORD_URL}?email=${request.result.email}`, request.result)
        .then((response) => {
            return response;
        });
};

export const activateUserService = (request) => {
    return axios
        .put(`${ACTIVATE_ACCOUNT_URL}?token=${request.result}`)
        .then((response) => response);
};

export const logoutUserService = () => {
    return axios.post(LOGOUT_URL).then((response) => response);
};
