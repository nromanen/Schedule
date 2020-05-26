import { call, put } from 'redux-saga/effects';
import * as actionTypes from '../redux/actions/actionsType';

import { activateUserService } from '../services/authService';

import i18n from '../helper/i18n';

export function* activateUserSaga(payload) {
    try {
        const response = yield call(activateUserService, payload);
        yield put({ type: actionTypes.ACTIVATE_USER_SUCCESS, response });
        yield put({ type: actionTypes.SET_LOADING_INDICATOR, result: false });
    } catch (error) {
        yield put({
            type: actionTypes.ACTIVATE_USER_ERROR,
            error: error.response
                ? error.response.data.message
                : i18n.t('common:error_message')
        });
        yield put({ type: actionTypes.SET_LOADING_INDICATOR, result: false });
    }
}
