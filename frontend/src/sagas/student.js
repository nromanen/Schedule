import { call, takeEvery, put } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { STUDENT_URL } from '../constants/axios';

import * as actionTypes from '../actions/actionsType';
import { STUDENT_FORM } from '../constants/reduxForms';
import { createErrorMessage, createDynamicMessage, createMessage } from '../utils/sagaUtils';
import {
    setOpenSuccessSnackbar,
    setOpenErrorSnackbar,
    setOpenInfoSnackbar,
} from '../actions/snackbar';
import { DELETE, POST, PUT } from '../constants/methods';
import { axiosCall } from '../services/axios';
import {
    deleteStudentSuccess,
    selectStudentSuccess,
    showAllStudents,
    updateStudentSuccess,
} from '../actions/students';
import {
    EXIST_LABEL,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { STUDENT } from '../constants/names';

function* fetchAllStudents({ id }) {
    try {
        const requestUrl = `groups/${id}/with-students`;
        const res = yield call(axiosCall, requestUrl);
        yield put(showAllStudents(res.data.students));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* createStudent({ data }) {
    try {
        yield call(axiosCall, STUDENT_URL, POST, data);
        yield put(reset(STUDENT_FORM));
        const message = createDynamicMessage(STUDENT, CREATED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* updateStudent({ data }) {
    try {
        const res = yield call(axiosCall, STUDENT_URL, PUT, data);
        yield put(updateStudentSuccess(res.data));
        yield put(selectStudentSuccess(null));
        yield put(reset(STUDENT_FORM));
        const message = createDynamicMessage(STUDENT, UPDATED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* submitStudentForm({ data, groupId }) {
    try {
        if (!data.id) {
            const newStudent = { ...data, group: { id: groupId } };
            yield call(createStudent, { data: newStudent });
        } else {
            const updatedStudent = { ...data, group: { id: data.group } };
            yield call(updateStudent, { data: updatedStudent });
        }
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* deleteStudent({ id }) {
    try {
        yield call(axiosCall, `${STUDENT_URL}/${id}`, DELETE);
        yield put(deleteStudentSuccess(id));
        const message = createDynamicMessage(STUDENT, DELETED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* setExistingGroupStudent() {
    try {
        const message = createMessage(
            'serviceMessages:students_exist_in_this_group',
            'common:student_title',
            EXIST_LABEL,
        );
        yield put(setOpenInfoSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* moveStudentsToGroup({ data }) {
    try {
        console.log(data);
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

export default function* studentWatcher() {
    yield takeEvery(actionTypes.MOVE_STUDENTS_TO_GROUP_START, moveStudentsToGroup);
    yield takeEvery(actionTypes.SET_EXISTING_GROUP_START, setExistingGroupStudent);
    yield takeEvery(actionTypes.SUBMIT_STUDENT_FORM, submitStudentForm);
    yield takeEvery(actionTypes.FETCH_ALL_STUDENTS, fetchAllStudents);
    yield takeEvery(actionTypes.CREATE_STUDENT_START, createStudent);
    yield takeEvery(actionTypes.UPDATE_STUDENT_START, updateStudent);
    yield takeEvery(actionTypes.DELETE_STUDENT_START, deleteStudent);
}
