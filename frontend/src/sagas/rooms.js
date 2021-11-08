import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { reset } from 'redux-form';
import * as actionTypes from '../actions/actionsType';
import { setLoading } from '../actions/loadingIndicator';
import { setOpenSuccessSnackbar, setOpenErrorSnackbar } from '../actions/snackbar';
import { axiosCall } from '../services/axios';
import i18n from '../i18n';
import { ROOM_URL } from '../constants/axios';
import { ROOM_FORM } from '../constants/reduxForms';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';
import { updateOneRoom, addRoom } from '../actions/rooms';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_ROOM_LABEL } from '../constants/translationLabels/formElements';

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

function* watchRooms() {
    yield takeEvery(actionTypes.ADD_ROOM_START, addRoomItem);
    yield takeEvery(actionTypes.UPDATE_ROOM_START, updateRoomItem);
    yield takeEvery(actionTypes.HANDLE_ROOM_FORM_SUBMIT_START, handleRoomFormSubmit);
}

export default watchRooms;
