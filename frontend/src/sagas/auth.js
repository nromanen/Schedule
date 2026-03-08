import {call, delay, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import jwtDecode from 'jwt-decode';
import * as actionTypes from '../actions/actionsType';

import {ACTIVATE_ACCOUNT_URL, LOGIN_URL, LOGOUT_URL, REGISTRATION_URL, RESET_PASSWORD_URL, USER_PROFILE,} from '../constants/axios';
import {
    activateSuccess,
    authAutoLogout,
    authSuccess,
    logout,
    registerUserSuccess,
    resetUserPasswordSuccess,
    setAuthError,
    setTeacher,
    setUser,
    setAuthLoading
} from '../actions';
import {axiosCall} from '../services/axios';
import {GOOGLE} from '../constants/common';
import {TOKEN_BEGIN} from '../constants/tokenBegin';
import axios from '../helper/axios';
import {GET, POST, PUT} from '../constants/methods';
import {createErrorMessage} from '../utils/sagaUtils';
import {ADMIN_PAGE_LINK, HOME_PAGE_LINK, SCHEDULE_FOR_LINK} from '../constants/links';

function* loadTeacherProfile() {
    try {
        const profileResponse = yield call(axiosCall, USER_PROFILE, GET);
        yield put(setUser(profileResponse.data));
        if (profileResponse.data.name) {
            yield put(setTeacher({
                id: profileResponse.data.id,
                name: profileResponse.data.name,
                surname: profileResponse.data.surname,
                patronymic: profileResponse.data.patronymic,
                position: profileResponse.data.position,
                department: profileResponse.data.department,
            }));
        }
    } catch (error) {
        console.error('Failed to load teacher profile', error);
    }
}

function* loginToAccount({ payload }) {
    try {
        const { history, ...loginData } = payload; // ← витягни history
        let response;
        if (loginData.type === GOOGLE) {
            response = { data: { token: loginData.token, email: '' } };
        } else {
            response = yield call(axiosCall, LOGIN_URL, POST, loginData); // ← loginData замість payload
        }
        const { token, email } = response.data;
        const decodedJWT = jwtDecode(token);
        const expirationDate = new Date(decodedJWT.exp * 1000);

        axios.defaults.headers.common.Authorization = TOKEN_BEGIN + token;

        yield localStorage.setItem('token', TOKEN_BEGIN + token);
        yield localStorage.setItem('expirationDate', expirationDate);
        yield localStorage.setItem('userRole', decodedJWT.roles);
        yield localStorage.setItem('email', email || decodedJWT.sub);

        yield put(authSuccess({ token, role: decodedJWT.roles, email }));
        yield put(authAutoLogout(decodedJWT.exp * 1000 - new Date().getTime()));

        if (decodedJWT.roles === 'ROLE_TEACHER') {
            yield call(loadTeacherProfile);
            const teacher = yield select(state => state.teachers.teacher);
            history.push(`${SCHEDULE_FOR_LINK}?teacher=${teacher?.id || ''}`);
        } else if (decodedJWT.roles === 'ROLE_MANAGER') {
            history.push(ADMIN_PAGE_LINK);
        } else {
            history.push(HOME_PAGE_LINK);
        }
    } catch (error) {
        yield put(
            setAuthError({
                login: createErrorMessage({ response: error.response }),
            }),
        );
    } finally {
        yield put(setAuthLoading(false));
    }
}

function* registerAccount({ payload }) {
    try {
        const response = yield call(axiosCall, REGISTRATION_URL, POST, payload);
        yield put(registerUserSuccess(response));
    } catch (error) {
        yield put(
            setAuthError({
                registration: createErrorMessage({ response: error.response }),
            }),
        );
    } finally {
        yield put(setAuthLoading(false));
    }
}

function* logoutOfAccount(payload) {
    try {
        yield call(axiosCall, LOGOUT_URL, POST, payload);
        yield put(logout());
    } catch (error) {
        yield put(
            setAuthError({
                login: createErrorMessage({ response: error.response }),
            }),
        );
    }
}

function* checkAuthState(payload) {
    const { token, role } = payload;
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (!token || expirationDate <= new Date()) {
        yield put(logout());
    } else {
        yield put(authSuccess({ token, role }));

        if (role === 'ROLE_TEACHER') {
            yield call(loadTeacherProfile);
        }
    }
}

function* checkAuthTimeout(action) {
    yield delay(action.expirationTime);
    yield call(logoutOfAccount);
}

function* activateUserAccount({ payload }) {
    try {
        const response = yield call(axiosCall, `${ACTIVATE_ACCOUNT_URL}?token=${payload}`, PUT);
        yield put(activateSuccess(response));
    } catch (error) {
        yield put(
            setAuthError({
                activationError: createErrorMessage({ response: error.response }),
            }),
        );
    } finally {
        yield put(setAuthLoading(false));
    }
}

function* resetPassword({ payload }) {
    try {
        const response = yield call(
            axiosCall,
            `${RESET_PASSWORD_URL}?email=${payload.email}`,
            PUT,
            payload,
        );
        yield put(resetUserPasswordSuccess(response));
    } catch (error) {
        yield put(
            setAuthError({
                resetPassword: createErrorMessage({ response: error.response }),
            }),
        );
    } finally {
        yield put(setAuthLoading(false));
    }
}

export default function* watchUserAuthentication() {
    yield takeLatest(actionTypes.REGISTER_USER, registerAccount);
    yield takeLatest(actionTypes.ACTIVATE_USER, activateUserAccount);
    yield takeLatest(actionTypes.RESET_USER_PASSWORD, resetPassword);
    yield takeLatest(actionTypes.AUTH_USER, loginToAccount);
    yield takeEvery(actionTypes.AUTH_USER_CHECK_STATE, checkAuthState);
    yield takeEvery(actionTypes.AUTH_USER_AUTO_LOGOUT, checkAuthTimeout);
    yield takeLatest(actionTypes.AUTH_USER_INITIATE_LOGOUT, logoutOfAccount);
}
