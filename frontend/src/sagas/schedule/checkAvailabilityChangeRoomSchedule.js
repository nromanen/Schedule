import { call, put } from 'redux-saga/effects';
import { setOpenSnackbar, checkAvailabilitySchedule, setLoading } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { ROOMS_AVAILABILITY } from '../../constants/axios';

export function* checkAvailabilityChangeRoomSchedule({ item }) {
    const { periodId, dayOfWeek, evenOdd, semesterId } = item;
    const requestUrl = `${ROOMS_AVAILABILITY}?classId=${periodId}&dayOfWeek=${dayOfWeek}&evenOdd=${evenOdd}&semesterId=${semesterId}`;
    try {
        const response = yield call(axiosCall, requestUrl);
        yield put(
            checkAvailabilitySchedule({
                classSuitsToTeacher: true,
                teacherAvailable: true,
                rooms: response.data,
            }),
        );
        yield put(setLoading(false));
    } catch (error) {
        const errorMessage = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        yield put(setOpenSnackbar(true, snackbarTypes.ERROR, errorMessage));
        yield put(setLoading(false));
    }
}
