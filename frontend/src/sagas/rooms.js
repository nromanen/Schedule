import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { reset } from 'redux-form';
import * as actionTypes from '../actions/actionsType';
import { setLoading } from '../actions/loadingIndicator';
import { setOpenSuccessSnackbar, setOpenErrorSnackbar } from '../actions/snackbar';
import { axiosCall } from '../services/axios';
import i18n from '../i18n';
import { ROOM_URL, DISABLED_ROOMS_URL, ROOM_TYPES_URL } from '../constants/axios';
import { ROOM_FORM } from '../constants/reduxForms';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';
import {
    updateOneRoom,
    addRoom,
    getListOfRoomsSuccess,
    getListOfDisabledRoomsSuccess,
} from '../actions/rooms';
import { getAllRoomTypesSuccess } from '../actions/roomTypes';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_ROOM_LABEL } from '../constants/translationLabels/formElements';

export function* getListOfRooms() {
    try {
        yield put(setLoading(true));
        const { data } = yield call(axiosCall, ROOM_URL);
        yield put(getListOfRoomsSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

export function* getListOfDisabledRooms() {
    try {
        yield put(setLoading(true));
        const { data } = yield call(axiosCall, DISABLED_ROOMS_URL);
        yield put(getListOfDisabledRoomsSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

export function* updateRoomItem({ values }) {
    try {
        const { data } = yield call(axiosCall, ROOM_URL, 'PUT', values);
        yield put(updateOneRoom(data));
        yield put(reset(ROOM_FORM));
        const message = createMessage(BACK_END_SUCCESS_OPERATION, FORM_ROOM_LABEL, UPDATED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}
export function* addRoomItem({ values }) {
    try {
        const { data } = yield call(axiosCall, ROOM_URL, 'POST', values);
        yield put(addRoom(data));
        yield put(reset(ROOM_FORM));
        const message = createMessage(BACK_END_SUCCESS_OPERATION, FORM_ROOM_LABEL, CREATED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* handleRoomFormSubmit({ values }) {
    try {
        if (values.id) {
            yield call(updateRoomItem, { values });
        } else {
            yield call(addRoomItem, { values });
        }
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* getAllRoomTypes() {
    try {
        const { data } = yield call(axiosCall, ROOM_TYPES_URL);
        yield put(getAllRoomTypesSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

function* watchRooms() {
    yield takeLatest(actionTypes.GET_LIST_OF_ROOMS_START, getListOfRooms);
    yield takeLatest(actionTypes.GET_LIST_OF_DISABLED_ROOMS_START, getListOfDisabledRooms);
    yield takeLatest(actionTypes.GET_ALL_ROOM_TYPES_START, getAllRoomTypes);
    yield takeEvery(actionTypes.ADD_ROOM_START, addRoomItem);
    yield takeEvery(actionTypes.UPDATE_ROOM_START, updateRoomItem);
    yield takeEvery(actionTypes.HANDLE_ROOM_FORM_SUBMIT_START, handleRoomFormSubmit);
}

export default watchRooms;
