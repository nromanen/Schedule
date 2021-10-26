import { call, put } from 'redux-saga/effects';
import { checkAvailabilitySchedule, setLoading, setOpenSnackbar } from '../../actions';
import { SCHEDULE_CHECK_AVAILABILITY_URL } from '../../constants/axios';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';

export function* checkScheduleItemAvailability({ item }) {
    const { periodId, dayOfWeek, evenOdd, lessonId, semesterId } = item;
    const requestUrl = `${SCHEDULE_CHECK_AVAILABILITY_URL}?classId=${periodId}&dayOfWeek=${dayOfWeek}&evenOdd=${evenOdd}&lessonId=${lessonId}&semesterId=${semesterId}`;
    try {
        const response = yield call(axiosCall, requestUrl);
        yield put(checkAvailabilitySchedule(response.data));
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
