import { call, put } from 'redux-saga/effects';
import { setLoading, setOpenSnackbar, setTeacherRangeSchedule } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { FOR_TEACHER_SCHEDULE_URL } from '../../constants/axios';

export function* getTeacherRangeSchedule({ values }) {
    try {
        const { startDay, endDay } = values;
        const fromUrlPart = startDay.replace(/\//g, '-');
        const toUrlPart = endDay.replace(/\//g, '-');
        const requestUrl = `${FOR_TEACHER_SCHEDULE_URL}?from=${fromUrlPart}&to=${toUrlPart}`;
        const response = yield call(axiosCall, requestUrl);
        yield put(setTeacherRangeSchedule(response.data));
        yield put(setLoading(false));
    } catch (error) {
        yield put(setLoading(false));
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}
