import {call, put, takeLatest} from 'redux-saga/effects';
import {axiosCall} from '../services/axios';
import * as actionTypes from '../actions/actionsType';

import {CLASS_URL, PUBLIC_CLASSES_URL} from '../constants/axios';
import {
    getClassScheduleListSuccess,
    getPublicClassScheduleSuccess,
} from '../actions/classes';

import {setLoading} from '../actions';

import {GET} from '../constants/methods';
import {setOpenErrorSnackbar} from '../actions/snackbar';
import {createErrorMessage} from '../utils/sagaUtils';

export function* getClassScheduleList() {
    try {
        const response = yield call(axiosCall, CLASS_URL, GET);
        yield put(getClassScheduleListSuccess(response.data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}
export function* getPublicClassScheduleList() {
    try {
        const response = yield call(axiosCall, PUBLIC_CLASSES_URL, GET);
        yield put(getPublicClassScheduleSuccess(response.data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

export default function* watchClasses() {
    yield takeLatest(actionTypes.GET_CLASS_SCHEDULE_LIST_START, getClassScheduleList);
    yield takeLatest(actionTypes.GET_PUBLIC_CLASS_SCHEDULE_LIST_START, getPublicClassScheduleList);
}
