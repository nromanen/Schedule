import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionsType';
import { showAllSemesters, setDisabledSemesters, setArchivedSemesters } from '../actions/semesters';
import { axiosCall } from '../services/axios';
import i18n from '../i18n';
import { setOpenSnackbar } from '../actions';
import { snackbarTypes } from '../constants/snackbarTypes';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import {
    DISABLED_SEMESTERS_URL,
    SEMESTERS_URL,
    SEMESTER_COPY_URL,
    LESSONS_FROM_SEMESTER_COPY_URL,
    CREATE_ARCHIVE_SEMESTER,
    ARCHIVED_SEMESTERS_URL,
    DEFAULT_SEMESTER_URL,
} from '../constants/axios';

export function* getAllSemestersItems() {
    try {
        const response = yield call(axiosCall, SEMESTERS_URL);
        yield put(showAllSemesters(response.data.sort((a, b) => b.year - a.year)));
    } catch (error) {
        console.log(error);
        yield put(setOpenSnackbar(true, snackbarTypes.ERROR, 'Error'));
    }
}
export function* getDisabledSemestersItems() {
    try {
        const response = yield call(axiosCall, DISABLED_SEMESTERS_URL);
        yield put(setDisabledSemesters(response.data));
    } catch (error) {
        yield put(setOpenSnackbar(true, snackbarTypes.ERROR, 'Error'));
    }
}
export function* getArchivedSemestersItems() {
    try {
        const response = yield call(axiosCall, ARCHIVED_SEMESTERS_URL);
        yield put(setArchivedSemesters(response.data));
    } catch (error) {
        yield put(setOpenSnackbar(true, snackbarTypes.ERROR, 'Error'));
    }
}

export function* watchSemester() {
    yield takeLatest(actionTypes.GET_ALL_SEMESTERS_START, getAllSemestersItems);
    yield takeLatest(actionTypes.GET_DISABLED_SEMESTERS_START, getDisabledSemestersItems);
    yield takeLatest(actionTypes.GET_ALL_SEMESTERS_START, getArchivedSemestersItems);
}
