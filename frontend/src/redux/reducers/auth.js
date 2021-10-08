import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';
import axios from '../../helper/axios';

const initialState = {
    token: null,
    role: null,
    error: null,
    activationError: null,
};

const reducer = (state = initialState, action) => {
    const { response } = action;

    switch (action.type) {
        case actionTypes.AUTH_USER_SUCCESS:
            return updateObject(state, {
                token: response.token,
                role: response.role,
                error: null,
            });
        case actionTypes.AUTH_USER_ERROR:
            return updateObject(state, {
                response,
                error: { login: action.error },
            });
        case actionTypes.AUTH_USER_LOGOUT:
            delete axios.defaults.headers.common.Authorization;

            localStorage.removeItem('token');
            localStorage.removeItem('expirationDate');
            localStorage.removeItem('userRole');
            return updateObject(state, {
                response: null,
                token: null,
                error: null,
                role: null,
            });
        case actionTypes.REGISTER_USER_SUCCESS:
        case actionTypes.ACTIVATE_USER_SUCCESS:
            return updateObject(state, {
                response,
            });
        case actionTypes.REGISTER_USER_ERROR:
            return updateObject(state, {
                error: { registration: { reg: action.error } },
            });
        case actionTypes.RESET_USER_PASSWORD_SUCCESS:
            return updateObject(state, {
                resetPasswordResponse: response,
            });
        case actionTypes.RESET_USER_PASSWORD_ERROR:
            return updateObject(state, {
                error: action.error,
            });
        case actionTypes.ACTIVATE_USER_ERROR:
            return updateObject(state, {
                activationError: action.error,
            });
        case actionTypes.SET_AUTH_ERROR:
            return updateObject(state, {
                error: action.result,
            });
        default:
            return state;
    }
};

export default reducer;
