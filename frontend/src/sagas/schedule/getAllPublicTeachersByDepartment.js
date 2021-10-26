import { call, put } from 'redux-saga/effects';
import { setOpenSnackbar } from '../../actions';
import { getAllTeachersByDepartmentId } from '../../actions/teachers';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { DEPARTMENT_URL, TEACHER_URL } from '../../constants/axios';

export function* getAllPublicTeachersByDepartment({ departmentId }) {
    const requestUrl = `${DEPARTMENT_URL}/${departmentId}/${TEACHER_URL}`;
    try {
        const response = yield call(axiosCall, requestUrl);
        yield put(getAllTeachersByDepartmentId(response.data));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}
