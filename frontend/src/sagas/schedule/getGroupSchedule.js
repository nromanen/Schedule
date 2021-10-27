import { call, put } from 'redux-saga/effects';
import { setGroupSchedule, setLoading, setOpenSnackbar } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { GROUP_SCHEDULE_URL } from '../../constants/axios';
import { makeGroupSchedule } from '../../mappers/groupScheduleMapper';

export function* getGroupSchedule({ groupId, semesterId }) {
    const requestUrl = `${GROUP_SCHEDULE_URL + semesterId}&groupId=${groupId}`;
    try {
        const response = yield call(axiosCall, requestUrl);
        const mappedSchedule = yield call(makeGroupSchedule, response.data);
        yield put(setGroupSchedule(mappedSchedule));
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
