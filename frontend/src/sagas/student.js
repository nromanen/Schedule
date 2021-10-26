import { call, takeEvery, put, select } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { STUDENT_URL } from '../constants/axios';

import { resetFormHandler } from '../helper/formHelper';
import * as actionTypes from '../actions/actionsType';
import { STUDENT_FORM } from '../constants/reduxForms';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import i18n from '../i18n';
import {
    addStudent,
    deleteStudent,
    setStudent,
    showAllStudents,
    showAllStudentsByGroupId,
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
import { addGroup } from '../actions/groups';

function* fetchAllStudentsWorker() {
    try {
        const res = yield call(axiosCall, STUDENT_URL, 'GET');
        yield put(showAllStudents(res.data));
    } catch (err) {
        errorHandler(err);
    }
}

function* createStudentWorker({ data }) {
    try {
        const res = yield call(axiosCall, STUDENT_URL, 'POST', data);
        yield put(addGroup(res.data));
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
        yield put(setStudent(null));
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

export default function* studentWatcher() {
    yield takeEvery(actionTypes.FETCH_ALL_STUDENTS, fetchAllStudentsWorker);
    yield takeEvery(actionTypes.START_CREATE_STUDENTS, createStudentWorker);
    yield takeEvery(actionTypes.START_UPDATE_STUDENTS, updateStudentWorker);
}
