import {call, put, takeLatest} from 'redux-saga/effects';

import * as actionTypes from '../actions/actionsType';
import {setLoading, getListOfRoomsSuccess} from '../actions';
import {setOpenErrorSnackbar} from '../actions/snackbar';
import {axiosCall} from '../services/axios';
import { ROOM_ORDERED_URL } from '../constants/axios';
import {createErrorMessage} from '../utils/sagaUtils';

export function* getListOfRooms() {
    try {
        yield put(setLoading(true));
        const { data } = yield call(axiosCall, ROOM_ORDERED_URL);
        yield put(getListOfRoomsSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

function* watchRooms() {
    yield takeLatest(actionTypes.GET_LIST_OF_ROOMS_START, getListOfRooms);
}

export default watchRooms;
