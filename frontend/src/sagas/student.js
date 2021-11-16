import { call, takeEvery, put, select } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { STUDENT_URL, GROUP_URL, WITH_STUDENTS, STUDENTS_TO_GROUP_FILE } from '../constants/axios';

import * as actionTypes from '../actions/actionsType';
import { STUDENT_FORM } from '../constants/reduxForms';
import { createErrorMessage, createDynamicMessage, createMessage } from '../utils/sagaUtils';
import { setOpenSuccessSnackbar, setOpenErrorSnackbar } from '../actions/snackbar';
import { DELETE, POST, PUT } from '../constants/methods';
import { axiosCall } from '../services/axios';
import {
    deleteStudentSuccess,
    selectStudentSuccess,
    showAllStudents,
    updateStudentSuccess,
} from '../actions/students';
import {
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
    FILE_BACK_END_SUCCESS_OPERATION,
    FILE_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { STUDENT } from '../constants/names';
import { setStudentsLoading, setLoading } from '../actions/loadingIndicator';
import { FORM_STUDENTS_FILE_LABEL } from '../constants/translationLabels/formElements';

const getStudents = (state) => state.students.students;

function* getAllStudents({ id }) {
    try {
        yield put(showAllStudents([]));
        yield put(setStudentsLoading(true));
        const requestUrl = `${GROUP_URL}/${id}${WITH_STUDENTS}`;
        const res = yield call(axiosCall, requestUrl);
        yield put(showAllStudents(res.data.students));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    } finally {
        yield put(setStudentsLoading(false));
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

function* updateStudent({ data, groupId }) {
    try {
        const res = yield call(axiosCall, STUDENT_URL, PUT, data);
        if (data.group.id === +groupId) {
            yield put(updateStudentSuccess(res.data));
        } else {
            yield put(deleteStudentSuccess(data.id));
        }
        yield put(selectStudentSuccess(data.id));
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
            yield call(updateStudent, { data: updatedStudent, groupId });
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

function* uploadStudentsToGroup({ file, id }) {
    try {
        yield put(setLoading(true));
        const formData = new FormData();
        formData.append('file', file);
        yield call(axiosCall, `${STUDENTS_TO_GROUP_FILE}${id}`, POST, formData);
        const message = createMessage(
            FILE_BACK_END_SUCCESS_OPERATION,
            FORM_STUDENTS_FILE_LABEL,
            FILE_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    } finally {
        yield put(setLoading(false));
    }
}

function* moveStudentsToGroup({ group, newGroup }) {
    try {
        const students = yield select(getStudents);
        const movedStudents = students.filter((item) => item.checked === true);
        console.log(movedStudents, group, newGroup);
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

export default function* studentWatcher() {
    yield takeEvery(actionTypes.UPLOAD_FILE_STUDENT_START, uploadStudentsToGroup);
    yield takeEvery(actionTypes.MOVE_STUDENTS_TO_GROUP_START, moveStudentsToGroup);
    yield takeEvery(actionTypes.SUBMIT_STUDENT_FORM, submitStudentForm);
    yield takeEvery(actionTypes.CREATE_STUDENT_START, createStudent);
    yield takeEvery(actionTypes.UPDATE_STUDENT_START, updateStudent);
    yield takeEvery(actionTypes.DELETE_STUDENT_START, deleteStudent);
    yield takeEvery(actionTypes.GET_ALL_STUDENTS, getAllStudents);
}
