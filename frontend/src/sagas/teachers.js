import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionsType';
import { showAllTeachers } from '../actions';
import { setOpenErrorSnackbar } from '../actions/snackbar';
import { DEPARTMENT_URL, PUBLIC_TEACHER_URL, TEACHER_URL } from '../constants/axios';
import { axiosCall } from '../services/axios';
import { createErrorMessage } from '../utils/sagaUtils';
import { getAllTeachersByDepartmentId } from '../actions/teachers';

export function* getAllPublicTeachers() {
    try {
        const { data } = yield call(axiosCall, PUBLIC_TEACHER_URL);
        yield put(showAllTeachers(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* getAllPublicTeachersByDepartment({ departmentId }) {
    const requestUrl = `${DEPARTMENT_URL}/${departmentId}/${TEACHER_URL}`;
    try {
        const { data } = yield call(axiosCall, requestUrl);
        yield put(getAllTeachersByDepartmentId(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export default function* watchTeachers() {
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_TEACHERS_START, getAllPublicTeachers);
    yield takeLatest(
        actionTypes.GET_ALL_PUBLIC_TEACHERS_BY_DEPARTMENT_START,
        getAllPublicTeachersByDepartment,
    );
}
