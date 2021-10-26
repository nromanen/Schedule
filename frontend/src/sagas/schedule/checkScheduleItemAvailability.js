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
        yield put(
            setOpenSnackbar(
                true,
                snackbarTypes.ERROR,
                error.response
                    ? i18n.t(error.response.data.message, error.response.data.message)
                    : 'Error',
            ),
        );
        yield put(setLoading(false));
    }
}
