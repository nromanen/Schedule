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
        yield put(setOpenSnackbar(true, snackbarTypes.ERROR, i18n.t(NO_CURRENT_SEMESTER_ERROR)));
        yield put(setSemesterLoading(false));
    }
}
