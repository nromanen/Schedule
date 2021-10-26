import { call, put } from 'redux-saga/effects';
import { setOpenSnackbar } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { getScheduleItems } from './getScheduleItems';
import { SCHEDULE_ITEM_ROOM_CHANGE } from '../../constants/axios';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
} from '../../constants/translationLabels/serviceMessages';
import { COMMON_SCHEDULE_TITLE } from '../../constants/translationLabels/common';

export function* editRoomItemToSchedule({ item }) {
    try {
        const { roomId, itemId } = item;
        const requestUrl = `${SCHEDULE_ITEM_ROOM_CHANGE}?roomId=${roomId}&scheduleId=${itemId}`;
        yield call(axiosCall, requestUrl, 'PUT');
        const message = i18n.t(BACK_END_SUCCESS_OPERATION, {
            cardType: i18n.t(COMMON_SCHEDULE_TITLE),
            actionType: i18n.t(UPDATED_LABEL),
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
    }
}
