import { call, put, takeLatest, select } from 'redux-saga/effects';
import { reset } from 'redux-form';
import * as actionTypes from '../actions/actionsType';
import {
    setOpenSuccessSnackbar,
    setOpenErrorSnackbar,
    setOpenInfoSnackbar,
} from '../actions/snackbar';
import {
    showAllSemesters,
    setDisabledSemesters,
    setArchivedSemesters,
    updateSemester,
    selectSemester,
    deleteSemester,
    addSemester,
    moveToArchivedSemester,
} from '../actions/semesters';
import { setScheduleType, setFullSchedule } from '../actions/schedule';
import { axiosCall } from '../services/axios';
import i18n from '../i18n';
import { setOpenSnackbar } from '../actions';
import { snackbarTypes } from '../constants/snackbarTypes';
import {
    DISABLED_SEMESTERS_URL,
    SEMESTERS_URL,
    SEMESTER_COPY_URL,
    LESSONS_FROM_SEMESTER_COPY_URL,
    ARCHIVE_SEMESTER,
    ARCHIVED_SEMESTERS_URL,
    DEFAULT_SEMESTER_URL,
} from '../constants/axios';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
    SEMESTER_SERVICE_IS_ACTIVE,
    COPIED_LABEL,
    ARCHIVED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import {
    FORM_LESSON_LABEL,
    FORM_SEMESTER_LABEL,
} from '../constants/translationLabels/formElements';
import { SEMESTER_FORM } from '../constants/reduxForms';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';

export function* getAllSemestersItems() {
    try {
        const response = yield call(axiosCall, SEMESTERS_URL);
        yield put(showAllSemesters(response.data.sort((a, b) => b.year - a.year)));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}
export function* getDisabledSemestersItems() {
    try {
        const response = yield call(axiosCall, DISABLED_SEMESTERS_URL);
        yield put(setDisabledSemesters(response.data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}
export function* getArchivedSemestersItems() {
    try {
        const response = yield call(axiosCall, ARCHIVED_SEMESTERS_URL);
        yield put(setArchivedSemesters(response.data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}
export function* setGroupsToSemester({ semesterId, groups }) {
    try {
        const groupIds = groups.map((item) => `groupId=${item.id}`).join('&');
        const requestUrl = `${SEMESTERS_URL}/${semesterId}/groups?${groupIds}`;
        const response = yield call(axiosCall, requestUrl, 'PUT');
        yield put(updateSemester(response.data));
        yield put(selectSemester(null));
        yield put(reset(SEMESTER_FORM));
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_SEMESTER_LABEL,
            UPDATED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* deleteSemesterItem({ semesterId }) {
    try {
        const state = yield select();
        const semester = state.semesters.semesters.find((item) => item.id === semesterId);
        if (semester.currentSemester) {
            const message = i18n.t(SEMESTER_SERVICE_IS_ACTIVE);
            yield put(setOpenErrorSnackbar(message));
            return;
        }
        const requestUrl = `${SEMESTERS_URL}/${semesterId}`;
        yield call(axiosCall, requestUrl, 'DELETE');
        yield put(deleteSemester(semesterId));
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_SEMESTER_LABEL,
            DELETED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
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
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_SEMESTER_LABEL,
            UPDATED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}
export function* addSemesterItem({ item }) {
    try {
        const response = yield call(axiosCall, SEMESTERS_URL, 'POST', item);
        yield put(addSemester(response.data));
        yield put(reset(SEMESTER_FORM));
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_SEMESTER_LABEL,
            CREATED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}
export function* setDefaultSemesterById({ semesterId }) {
    try {
        const requestUrl = `${DEFAULT_SEMESTER_URL}?semesterId=${semesterId}`;
        const response = yield call(axiosCall, requestUrl, 'PUT', semesterId);
        yield put(updateSemester(response.data));
        yield put(selectSemester(null));
        yield call(getAllSemestersItems);
        yield call(getDisabledSemestersItems);
        yield put(reset(SEMESTER_FORM));
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_SEMESTER_LABEL,
            UPDATED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* semesterCopy({ values }) {
    try {
        const requestUrl = `${SEMESTER_COPY_URL}?fromSemesterId=${values.fromSemesterId}&toSemesterId=${values.toSemesterId}`;
        yield call(axiosCall, requestUrl, 'POST');
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_SEMESTER_LABEL,
            COPIED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}
export function* createArchiveSemester({ semesterId }) {
    try {
        const requestUrl = `${ARCHIVE_SEMESTER}/${semesterId}`;
        yield call(axiosCall, requestUrl, 'POST');
        yield put(moveToArchivedSemester(semesterId));
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_SEMESTER_LABEL,
            ARCHIVED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}
export function* getArchivedSemester({ semesterId }) {
    try {
        yield put(setScheduleType('archived'));
        const requestUrl = `${ARCHIVE_SEMESTER}/${semesterId}`;
        const response = yield call(axiosCall, requestUrl);
        yield put(setFullSchedule(response.data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}
export function* CopyLessonsFromSemester({ values }) {
    try {
        const requestUrl = `${LESSONS_FROM_SEMESTER_COPY_URL}?fromSemesterId=${values.fromSemesterId}&toSemesterId=${values.toSemesterId}`;
        yield call(axiosCall, requestUrl, 'POST');
        const message = createMessage(BACK_END_SUCCESS_OPERATION, FORM_LESSON_LABEL, COPIED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* watchSemester() {
    yield takeLatest(actionTypes.GET_ALL_SEMESTERS_START, getAllSemestersItems);
    yield takeLatest(actionTypes.GET_DISABLED_SEMESTERS_START, getDisabledSemestersItems);
    yield takeLatest(actionTypes.SET_ARCHIVED_SEMESTERS_START, getArchivedSemestersItems);
    yield takeLatest(actionTypes.SET_GROUPS_TO_SEMESTER_START, setGroupsToSemester);
    yield takeLatest(actionTypes.DELETE_SEMESTER_START, deleteSemesterItem);
    yield takeLatest(actionTypes.UPDATE_SEMESTER_START, updateSemesterItem);
    yield takeLatest(actionTypes.ADD_SEMESTER_START, addSemesterItem);
    yield takeLatest(actionTypes.UPDATE_SEMESTER_BY_ID_START, setDefaultSemesterById);
    yield takeLatest(actionTypes.SET_SEMESTER_COPY_START, semesterCopy);
    yield takeLatest(actionTypes.CREATE_ARCHIVE_SEMESTER_START, createArchiveSemester);
    yield takeLatest(actionTypes.GET_ARCHIVE_SEMESTER_START, getArchivedSemester);
    yield takeLatest(actionTypes.COPY_LESSONS_FROM_SEMESTER_START, CopyLessonsFromSemester);
}
