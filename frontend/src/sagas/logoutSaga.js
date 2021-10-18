import { call, put } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionsType';

import { logoutUserService } from '../services/authService';

import { COMMON_ERROR_MESSAGE } from '../constants/translationLabels/common';
import i18n from '../i18n';

export function* logoutSaga(payload) {
    try {
        yield call(logoutUserService, payload);
        yield put({
            type: actionTypes.AUTH_USER_LOGOUT,
        });
    } catch (error) {
        yield put({
            type: actionTypes.AUTH_USER_ERROR,
            error: error.response ? error.response.data.message : i18n.t(COMMON_ERROR_MESSAGE),
        });
    }
}
