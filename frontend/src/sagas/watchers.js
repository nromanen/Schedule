import { takeLatest, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../redux/actions/actionsType';

import { authSaga } from './authSaga';
import { logoutSaga } from './logoutSaga';
import { checkAuthTimeoutSaga } from './checkAuthTimeoutSaga';
import { checkAuthStateSaga } from './checkAuthStateSaga';
import { registrationSaga } from './registrationSaga';
import { activateUserSaga } from './activateUserSaga';
import { resetUserPasswordSaga } from './resetUserPasswordSaga';

export default function* watchUserAuthentication() {
    yield takeLatest(actionTypes.REGISTER_USER, registrationSaga);
    yield takeLatest(actionTypes.ACTIVATE_USER, activateUserSaga);
    yield takeLatest(actionTypes.RESET_USER_PASSWORD, resetUserPasswordSaga);
    yield takeLatest(actionTypes.AUTH_USER, authSaga);
    yield takeEvery(actionTypes.AUTH_USER_CHECK_STATE, checkAuthStateSaga);
    yield takeEvery(actionTypes.AUTH_USER_AUTO_LOGOUT, checkAuthTimeoutSaga);
    yield takeLatest(actionTypes.AUTH_USER_INITIATE_LOGOUT, logoutSaga);
}
