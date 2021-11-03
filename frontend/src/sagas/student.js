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
        const requestUrl = `groups/${id}/with-students`;
        const res = yield call(axiosCall, requestUrl);
        yield put(showAllStudents(res.data.students));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* createStudentWorker({ data }) {
    try {
        console.log(data);
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

function* submitStudentForm({ data, groupId }) {
    try {
        if (!data.id) {
            const createStudent = { ...data, group: { id: groupId } };
            yield call(createStudentWorker, { data: createStudent });
        } else {
            const updatedStudent = { ...data, group: { id: data.group } };
            yield call(updateStudentWorker, { data: updatedStudent });
        }
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
    yield takeEvery(actionTypes.CREATE_STUDENT_START, createStudentWorker);
    yield takeEvery(actionTypes.UPDATE_STUDENT_START, updateStudentWorker);
    yield takeEvery(actionTypes.DELETE_STUDENT_START, deleteStudentWorker);
    yield takeEvery(actionTypes.SUBMIT_STUDENT_FORM, submitStudentForm);
}
