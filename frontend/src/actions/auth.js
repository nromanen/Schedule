import * as actionTypes from './actionsType';
import { TOKEN_BEGIN } from '../constants/tokenBegin';

export const authUser = (res) => {
    return {
        type: actionTypes.AUTH_USER,
        result: res,
    };
};
export const authAutoLogout = (res) => {
    return {
        type: actionTypes.AUTH_USER_AUTO_LOGOUT,
        expirationTime: res,
    };
};

export const registerUser = (res) => {
    return {
        type: actionTypes.REGISTER_USER,
        result: res,
    };
};

export const resetUserPassword = (res) => {
    return {
        type: actionTypes.RESET_USER_PASSWORD,
        result: res,
    };
};

export const activateUser = (res) => {
    return {
        type: actionTypes.ACTIVATE_USER,
        result: res,
    };
};

export const logout = () => {
    return {
        type: actionTypes.AUTH_USER_LOGOUT,
    };
};

export const authCheckState = () => {
    const token = localStorage.getItem('token');
    if (token && !token.includes(TOKEN_BEGIN)) {
        return {
            type: actionTypes.AUTH_USER_LOGOUT,
        };
    }
    const role = localStorage.getItem('userRole');
    return {
        type: actionTypes.AUTH_USER_CHECK_STATE,
        token,
        role,
    };
};
export const activateSuccess = (res) => {
    return { type: actionTypes.ACTIVATE_USER_SUCCESS, response: res };
};
export const resetUserPasswordSuccess = (res) => {
    return { type: actionTypes.RESET_USER_PASSWORD_SUCCESS, response: res };
};
export const registerUserSuccess = (res) => {
    return { type: actionTypes.REGISTER_USER_SUCCESS, response: res };
};
export const authSuccess = (res) => {
    return {
        type: actionTypes.AUTH_USER_SUCCESS,
        response: res,
    };
};
export const setAuthError = (res) => {
    return {
        type: actionTypes.SET_AUTH_ERROR,
        result: res,
    };
};
