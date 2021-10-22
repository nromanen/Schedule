import { put } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionsType';

export function* checkAuthStateSaga(payload) {
    if (!payload.token) {
        yield put({ type: actionTypes.AUTH_USER_LOGOUT });
    } else {
        const expirationDate = new Date(localStorage.getItem('expirationDate'));
        if (expirationDate <= new Date()) {
            yield put({ type: actionTypes.AUTH_USER_LOGOUT });
        } else {
            yield put({
                type: actionTypes.AUTH_USER_SUCCESS,
                response: {
                    token: payload.token,
                    role: payload.role,
                },
            });
        }
    }
}
