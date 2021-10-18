import { call, put } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionsType';

import { resetUserPasswordService } from '../services/authService';

import { COMMON_ERROR_MESSAGE } from '../constants/translationLabels/common';
import i18n from '../i18n';

export function* resetUserPasswordSaga(payload) {
    try {
        const response = yield call(resetUserPasswordService, payload);
        yield put({ type: actionTypes.RESET_USER_PASSWORD_SUCCESS, response });
        yield put({ type: actionTypes.SET_LOADING_INDICATOR, result: false });
    } catch (error) {
        yield put({
            type: actionTypes.RESET_USER_PASSWORD_ERROR,
            error: error.response ? error.response.data.message : i18n.t(COMMON_ERROR_MESSAGE),
        });
        yield put({ type: actionTypes.SET_LOADING_INDICATOR, result: false });
    }
}
