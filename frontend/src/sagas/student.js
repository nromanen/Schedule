import { errorHandler, successHandler } from '../helper/handlerAxios';
import { call, takeEvery, put } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { STUDENT_URL } from '../constants/axios';

import * as actionTypes from '../actions/actionsType';
import { STUDENT_FORM } from '../constants/reduxForms';
import i18n from '../i18n';
import {
    deleteStudent,
    selectStudentSuccess,
    showAllStudents,
    updateStudent,
} from '../actions/students';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_STUDENT_LABEL } from '../constants/translationLabels/formElements';
import { axiosCall } from '../services/axios';

function* fetchAllStudentsWorker({ id }) {
    try {
        const res = yield call(axiosCall, `groups/${id}/with-students`, 'GET');
        yield put(showAllStudents(res.data.students));
    } catch (err) {
        errorHandler(err);
    }
}

function* createStudentWorker({ data }) {
    try {
        yield call(axiosCall, STUDENT_URL, 'POST', data);
        yield put(reset(STUDENT_FORM));
        successHandler(
            i18n.t(BACK_END_SUCCESS_OPERATION, {
                cardType: i18n.t(FORM_STUDENT_LABEL),
                actionType: i18n.t(CREATED_LABEL),
            }),
        );
    } catch (err) {
        errorHandler(err);
    }
}

function* updateStudentWorker({ data }) {
    try {
        const res = yield call(axiosCall, STUDENT_URL, 'PUT', data);
        yield put(updateStudent(res.data));
        yield put(selectStudentSuccess(null));
        yield put(reset(STUDENT_FORM));
        successHandler(
            i18n.t(BACK_END_SUCCESS_OPERATION, {
                cardType: i18n.t(FORM_STUDENT_LABEL),
                actionType: i18n.t(UPDATED_LABEL),
            }),
        );
    } catch (err) {
        errorHandler(err);
    }
}

function* deleteStudentWorker({ id }) {
    try {
        yield call(axiosCall, `${STUDENT_URL}/${id}`, 'DELETE');
        yield put(deleteStudent(id));
        successHandler(
            i18n.t(BACK_END_SUCCESS_OPERATION, {
                cardType: i18n.t(FORM_STUDENT_LABEL),
                actionType: i18n.t(DELETED_LABEL),
            }),
        );
    } catch (err) {
        errorHandler(err);
    }
}

export default function* studentWatcher() {
    yield takeEvery(actionTypes.FETCH_ALL_STUDENTS, fetchAllStudentsWorker);
    yield takeEvery(actionTypes.START_CREATE_STUDENTS, createStudentWorker);
    yield takeEvery(actionTypes.START_UPDATE_STUDENTS, updateStudentWorker);
    yield takeEvery(actionTypes.START_DELETE_STUDENTS, deleteStudentWorker);
}
