import { call, put } from 'redux-saga/effects';
import { setCurrentSemester, setLoading, setOpenSnackbar } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { NO_CURRENT_SEMESTER_ERROR } from '../../constants/translationLabels/common';
import { CURRENT_SEMESTER_URL } from '../../constants/axios';
import { getScheduleItemsBySemester } from './getScheduleItemsBySemester';
import { showBusyRooms } from '../../services/busyRooms';

export function* getScheduleItems() {
    try {
        const response = yield call(axiosCall, CURRENT_SEMESTER_URL);
        yield put(setCurrentSemester(response.data));
        yield call(showBusyRooms, response.data.id);
        yield call(getScheduleItemsBySemester, response.data.id);
    } catch (error) {
        const message = i18n.t(NO_CURRENT_SEMESTER_ERROR);
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setLoading(false));
    }
}
