import { call, put } from 'redux-saga/effects';
import { setOpenSnackbar, showAllTeachers } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { PUBLIC_TEACHER_URL } from '../../constants/axios';

export function* getAllPublicTeachers() {
    try {
        const response = yield call(axiosCall, PUBLIC_TEACHER_URL);
        yield put(showAllTeachers(response.data));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}
