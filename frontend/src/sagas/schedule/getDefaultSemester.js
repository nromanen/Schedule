import { call, put } from 'redux-saga/effects';
import { setDefaultSemester, setOpenSnackbar, setSemesterLoading } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { NO_CURRENT_SEMESTER_ERROR } from '../../constants/translationLabels/common';
import { DEFAULT_SEMESTER_URL } from '../../constants/axios';

export function* getDefaultSemester() {
    try {
        const response = yield call(axiosCall, DEFAULT_SEMESTER_URL);
        yield put(setSemesterLoading(false));
        yield put(setDefaultSemester(response.data));
    } catch (error) {
        const message = i18n.t(NO_CURRENT_SEMESTER_ERROR);
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setSemesterLoading(false));
    }
}
