import { call, put } from 'redux-saga/effects';
import { setFullSchedule, setLoading, setOpenSnackbar } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { FULL_SCHEDULE_URL } from '../../constants/axios';
import { makeFullSchedule } from '../../mappers/fullScheduleMapper';

export function* getFullSchedule({ semesterId }) {
    const requestUrl = FULL_SCHEDULE_URL + semesterId;
    try {
        yield put(setLoading(true));
        const response = yield call(axiosCall, requestUrl);
        const mappedSchedule = yield call(makeFullSchedule, response.data);
        yield put(setFullSchedule(mappedSchedule));
        yield put(setLoading(false));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setLoading(false));
    }
}
