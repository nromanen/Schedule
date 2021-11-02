import { call, put } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionsType';

import { activateUserService } from '../services/authService';

import { COMMON_ERROR_MESSAGE } from '../constants/translationLabels/common';
import i18n from '../i18n';

export function* activateUserSaga(payload) {
    try {
        const response = yield call(activateUserService, payload);
        yield put({ type: actionTypes.ACTIVATE_USER_SUCCESS, response });
        yield put({ type: actionTypes.SET_LOADING_INDICATOR, result: false });
    } catch (error) {
        yield put({
            type: actionTypes.ACTIVATE_USER_ERROR,
            error: error.response ? error.response.data.message : i18n.t(COMMON_ERROR_MESSAGE),
        });
        yield put({ type: actionTypes.SET_LOADING_INDICATOR, result: false });
    }
}