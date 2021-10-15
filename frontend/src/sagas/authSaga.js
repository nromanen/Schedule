import { call, put } from 'redux-saga/effects';
import jwtDecode from 'jwt-decode';
import * as actionTypes from '../actions/actionsType';

import { authUserService } from '../services/authService';

import { TOKEN_BEGIN } from '../constants/tokenBegin';
import axios from '../helper/axios';
import { COMMON_ERROR_MESSAGE } from '../constants/translationLabels/common';
import i18n from '../i18n';

export function* authSaga(payload) {
    try {
        const response = yield call(authUserService, payload);

        const { token } = response.data;
        const { email } = response.data;
        const decodedJWT = jwtDecode(token);
        const expirationDate = new Date(decodedJWT.exp * 1000);

        axios.defaults.headers.common.Authorization = TOKEN_BEGIN + token;

        yield localStorage.setItem('token', TOKEN_BEGIN + token);
        yield localStorage.setItem('expirationDate', expirationDate);
        yield localStorage.setItem('userRole', decodedJWT.roles);
        yield localStorage.setItem('email', email || decodedJWT.sub);

        yield put({
            type: actionTypes.AUTH_USER_SUCCESS,
            response: { token, role: decodedJWT.roles, email },
        });

        yield put({ type: actionTypes.SET_LOADING_INDICATOR, result: false });

        yield put({
            type: actionTypes.AUTH_USER_AUTO_LOGOUT,
            expirationTime: decodedJWT.exp * 1000 - new Date().getTime(),
        });
    } catch (error) {
        yield put({
            type: actionTypes.AUTH_USER_ERROR,
            error: error.response ? error.response.data.message : i18n.t(COMMON_ERROR_MESSAGE),
        });
        yield put({ type: actionTypes.SET_LOADING_INDICATOR, result: false });
    }
}
