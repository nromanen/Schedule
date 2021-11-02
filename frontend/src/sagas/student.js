import { call, takeEvery, put } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { STUDENT_URL } from '../constants/axios';

import * as actionTypes from '../actions/actionsType';
import { STUDENT_FORM } from '../constants/reduxForms';
import { createErrorMessage, createDynamicMessage } from '../utils/sagaUtils';
import { setOpenSuccessSnackbar, setOpenErrorSnackbar } from '../actions/snackbar';
import { DELETE, POST, PUT } from '../constants/methods';
import { axiosCall } from '../services/axios';
import {
    deleteStudent,
    selectStudentSuccess,
    showAllStudents,
    updateStudent,
} from '../actions/students';
import {
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';

function* fetchAllStudentsWorker({ id }) {
    try {
        const res = yield call(axiosCall, `groups/${id}/with-students`, 'GET');
        yield put(showAllStudents(res.data.students));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* createStudentWorker({ data }) {
    try {
        yield call(axiosCall, STUDENT_URL, POST, data);
        yield put(reset(STUDENT_FORM));
        const message = createDynamicMessage('student', CREATED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* updateStudentWorker({ data }) {
    try {
        const res = yield call(axiosCall, STUDENT_URL, PUT, data);
        yield put(updateStudent(res.data));
        yield put(selectStudentSuccess(null));
        yield put(reset(STUDENT_FORM));
        const message = createDynamicMessage('student', UPDATED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* deleteStudentWorker({ id }) {
    try {
        yield call(axiosCall, `${STUDENT_URL}/${id}`, DELETE);
        yield put(deleteStudent(id));
        const message = createDynamicMessage('student', DELETED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

export default function* studentWatcher() {
    yield takeEvery(actionTypes.FETCH_ALL_STUDENTS, fetchAllStudentsWorker);
    yield takeEvery(actionTypes.START_CREATE_STUDENTS, createStudentWorker);
    yield takeEvery(actionTypes.START_UPDATE_STUDENTS, updateStudentWorker);
    yield takeEvery(actionTypes.START_DELETE_STUDENTS, deleteStudentWorker);
}
