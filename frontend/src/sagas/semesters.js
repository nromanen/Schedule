import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { reset } from 'redux-form';
import * as actionTypes from '../actions/actionsType';
import { store } from '../store';
import {
    showAllSemesters,
    setDisabledSemesters,
    setArchivedSemesters,
    updateSemester,
    selectSemester,
    deleteSemester,
    addSemester,
} from '../actions/semesters';
import { axiosCall } from '../services/axios';
import i18n from '../i18n';
import { setOpenSnackbar } from '../actions';
import { snackbarTypes } from '../constants/snackbarTypes';
import {
    DISABLED_SEMESTERS_URL,
    SEMESTERS_URL,
    SEMESTER_COPY_URL,
    LESSONS_FROM_SEMESTER_COPY_URL,
    CREATE_ARCHIVE_SEMESTER,
    ARCHIVED_SEMESTERS_URL,
    DEFAULT_SEMESTER_URL,
} from '../constants/axios';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
    SEMESTER_SERVICE_IS_ACTIVE,
    SEMESTER_SERVICE_NOT_AS_BEGIN_OR_END,
    COPIED_LABEL,
    ARCHIVED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import {
    FORM_LESSON_LABEL,
    FORM_SEMESTER_LABEL,
} from '../constants/translationLabels/formElements';
import { COMMON_SEMESTER_IS_NOT_UNIQUE } from '../constants/translationLabels/common';
import { SEMESTER_FORM } from '../constants/reduxForms';

export function* getAllSemestersItems() {
    try {
        const response = yield call(axiosCall, SEMESTERS_URL);
        yield put(showAllSemesters(response.data.sort((a, b) => b.year - a.year)));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}
export function* getDisabledSemestersItems() {
    try {
        const response = yield call(axiosCall, DISABLED_SEMESTERS_URL);
        yield put(setDisabledSemesters(response.data));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}
export function* getArchivedSemestersItems() {
    try {
        const response = yield call(axiosCall, ARCHIVED_SEMESTERS_URL);
        yield put(setArchivedSemesters(response.data));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}
export function* setGroupsToSemester({ semesterId, groups }) {
    try {
        const groupIds = groups.map((item) => `groupId=${item.id}`).join('&');
        const responseUrl = `${SEMESTERS_URL}/${semesterId}/groups?${groupIds}`;
        const response = yield call(axiosCall, responseUrl, 'PUT');
        yield put(updateSemester(response.data));
        yield put(selectSemester(null));
        // yield call(getAllSemestersItems);
        // yield call(getDisabledSemestersItems);
        // yield call(getArchivedSemestersItems);
        yield put(reset(SEMESTER_FORM));
        yield put(
            setOpenSnackbar(
                true,
                snackbarTypes.SUCCESS,
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SEMESTER_LABEL),
                    actionType: i18n.t(UPDATED_LABEL),
                }),
            ),
        );
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}

export function* deleteSemesterCard({ semesterId }) {
    try {
        const semester = store
            .getState()
            .semesters.semesters.find((item) => item.id === semesterId);
        console.log('semester', semester);
        if (semester.currentSemester) {
            const message = i18n.t(SEMESTER_SERVICE_IS_ACTIVE);
            const isOpen = true;
            const type = snackbarTypes.ERROR;
            yield put(setOpenSnackbar({ isOpen, type, message }));
            return;
        }
        const responseUrl = `${SEMESTERS_URL}/${semesterId}`;
        yield call(axiosCall, responseUrl, 'DELETE');
        yield put(deleteSemester(semesterId));
        yield put(
            setOpenSnackbar(
                true,
                snackbarTypes.SUCCESS,
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SEMESTER_LABEL),
                    actionType: i18n.t(DELETED_LABEL),
                }),
            ),
        );
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}

export function* updateSemesterItem({ item }) {
    try {
        const response = yield call(axiosCall, SEMESTERS_URL, 'PUT', item);
        yield put(updateSemester(response.data));
        yield put(selectSemester(null));
        yield call(getAllSemestersItems);
        yield call(getDisabledSemestersItems);
        yield put(reset(SEMESTER_FORM));
        yield put(
            setOpenSnackbar(
                true,
                snackbarTypes.SUCCESS,
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SEMESTER_LABEL),
                    actionType: i18n.t(UPDATED_LABEL),
                }),
            ),
        );
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}
export function* addSemesterItem({ item }) {
    try {
        const response = yield call(axiosCall, SEMESTERS_URL, 'POST', item);
        yield put(addSemester(response.data));
        yield put(reset(SEMESTER_FORM));
        yield put(
            setOpenSnackbar(
                true,
                snackbarTypes.SUCCESS,
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SEMESTER_LABEL),
                    actionType: i18n.t(CREATED_LABEL),
                }),
            ),
        );
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}

export function* watchSemester() {
    yield takeLatest(actionTypes.GET_ALL_SEMESTERS_START, getAllSemestersItems);
    yield takeLatest(actionTypes.GET_DISABLED_SEMESTERS_START, getDisabledSemestersItems);
    yield takeLatest(actionTypes.SET_ARCHIVED_SEMESTERS_START, getArchivedSemestersItems);
    yield takeLatest(actionTypes.SET_GROUPS_TO_SEMESTER_START, setGroupsToSemester);
    yield takeLatest(actionTypes.DELETE_SEMESTER_START, deleteSemesterCard);
    yield takeLatest(actionTypes.UPDATE_SEMESTER_START, updateSemesterItem);
    yield takeLatest(actionTypes.ADD_SEMESTER_START, addSemesterItem);
}
