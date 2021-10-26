import { call, put } from 'redux-saga/effects';
import { setLoading, setOpenSnackbar } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { getScheduleItems } from './getScheduleItems';
import { CLEAR_SCHEDULE_URL } from '../../constants/axios';
import {
    BACK_END_SUCCESS_OPERATION,
    CLEARED_LABEL,
} from '../../constants/translationLabels/serviceMessages';
import { COMMON_SCHEDULE_TITLE } from '../../constants/translationLabels/common';

export function* clearSchedule({ semesterId }) {
    try {
        const requestUrl = `${CLEAR_SCHEDULE_URL}?semesterId=${semesterId}`;
        yield call(axiosCall, requestUrl, 'DELETE');
        const message = i18n.t(BACK_END_SUCCESS_OPERATION, {
            cardType: i18n.t(COMMON_SCHEDULE_TITLE),
            actionType: i18n.t(CLEARED_LABEL),
        });
        const isOpen = true;
        const type = snackbarTypes.SUCCESS;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield call(getScheduleItems);
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
