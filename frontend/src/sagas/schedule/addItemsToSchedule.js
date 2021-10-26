import { call, put } from 'redux-saga/effects';
import { setOpenSnackbar } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { getScheduleItems } from './getScheduleItems';
import { SCHEDULE_ITEMS_URL } from '../../constants/axios';

export function* addItemsToSchedule({ item }) {
    try {
        yield call(axiosCall, SCHEDULE_ITEMS_URL, 'POST', item);
        yield call(getScheduleItems);
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}
