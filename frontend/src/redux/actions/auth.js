import * as actionTypes from './actionsType';
import { TOKEN_BEGIN } from '../../constants/tokenBegin';

export const authUser = res => {
    return {
        type: actionTypes.AUTH_USER,
        result: res
    };
};

export const registerUser = res => {
    return {
        type: actionTypes.REGISTER_USER,
        result: res
    };
};

export const resetUserPassword = res => {
    return {
        type: actionTypes.RESET_USER_PASSWORD,
        result: res
    };
};

export const activateUser = res => {
    return {
        type: actionTypes.ACTIVATE_USER,
        result: res
    };
};

export const logout = () => {
    return {
        type: actionTypes.AUTH_USER_INITIATE_LOGOUT
    };
};

export const authCheckState = () => {
    const token = localStorage.getItem('token');
    if (token && !token.includes(TOKEN_BEGIN)) {
        return {
            type: actionTypes.AUTH_USER_LOGOUT
        }
    }
    const role = localStorage.getItem('userRole');
    return {
        type: actionTypes.AUTH_USER_CHECK_STATE,
        token,
        role
    }
};

export const setAuthError = res => {
    return {
        type: actionTypes.SET_AUTH_ERROR,
        result: res
    }
};



