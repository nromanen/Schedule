import { call, put } from 'redux-saga/effects';
import * as actionTypes from '../redux/actions/actionsType';

import { authUserService } from '../services/authService';

import { TOKEN_BEGIN } from '../constants/tokenBegin';

import axios from '../helper/axios';
import i18n from '../helper/i18n';

export function* authSaga(payload) {
    try {
        const response = yield call(authUserService, payload);

        const jwtDecode = require('jwt-decode');
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
            error: error.response ? error.response.data.message : i18n.t('common:error_message'),
        });
        yield put({ type: actionTypes.SET_LOADING_INDICATOR, result: false });
    }
}
