import { reset } from 'redux-form';
import { call, put, takeLatest } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionsType';
import { setScheduleLoading } from '../actions';
import { setOpenErrorSnackbar } from '../actions/snackbar';

import { BUSY_ROOMS, CURRENT_SEMESTER_URL } from '../constants/axios';
import { createErrorMessage } from '../utils/sagaUtils';
import { axiosCall } from '../services/axios';
import { getBusyRoomsSuccess } from '../actions/rooms';

export function* getBusyRooms() {
    try {
        const semesterResponse = yield call(axiosCall, CURRENT_SEMESTER_URL);
        const { id } = semesterResponse.data;
        const { data } = yield call(axiosCall, `${BUSY_ROOMS}?semesterId=${id}`);
        yield put(getBusyRoomsSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setScheduleLoading(false));
    }
}

export default function* watchRooms() {
    yield takeLatest(actionTypes.GET_BUSY_ROOMS_START, getBusyRooms);
}
