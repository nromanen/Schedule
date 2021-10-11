import { call, put } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionsType';

import { logoutUserService } from '../services/authService';

import i18n from '../helper/i18n';

export function* logoutSaga(payload) {
    try {
        yield call(logoutUserService, payload);
        yield put({
            type: actionTypes.AUTH_USER_LOGOUT,
        });
    } catch (error) {
        yield put({
            type: actionTypes.AUTH_USER_ERROR,
            error: error.response ? error.response.data.message : i18n.t('common:error_message'),
        });
    }
}
