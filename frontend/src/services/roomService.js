import { store } from '../store';

import { DISABLED_ROOMS_URL, ROOM_URL } from '../constants/axios';
import { ROOM_FORM } from '../constants/reduxForms';
import axios from '../helper/axios';
import {
    showListOfRooms,
    deleteRoom,
    addRoom,
    selectOneRoom,
    updateOneRoom,
    clearRoomOne,
    setDisabledRooms,
} from '../actions/rooms';

import { errorHandler, successHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_ROOM_LABEL } from '../constants/translationLabels/formElements';
import i18n from '../i18n';

export const showListOfRoomsService = () => {
    axios
        .get(ROOM_URL)
        .then((response) => {
            const results = response.data;
            store.dispatch(showListOfRooms(results));
        })
        .catch((error) => errorHandler(error));
};

export const getDisabledRoomsService = () => {
    axios
        .get(DISABLED_ROOMS_URL)
        .then((res) => {
            store.dispatch(setDisabledRooms(res.data));
        })
        .catch((error) => errorHandler(error));
};
export const deleteRoomCardService = (id) => {
    axios
        .delete(`${ROOM_URL}/${id}`)
        .then(() => {
            store.dispatch(deleteRoom(id));
            getDisabledRoomsService();
            showListOfRoomsService();
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_ROOM_LABEL),
                    actionType: i18n.t(DELETED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
// created saga
const put = (values) => {
    axios
        .put(ROOM_URL, values)
        .then((result) => {
            store.dispatch(updateOneRoom(result.data));
            resetFormHandler(ROOM_FORM);
            getDisabledRoomsService();
            showListOfRoomsService();
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_ROOM_LABEL),
                    actionType: i18n.t(UPDATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const setDisabledRoomsService = (room) => {
    const bufferRoom = room;
    bufferRoom.disable = true;
    put(bufferRoom);
};

export const setEnabledRoomsService = (room) => {
    const bufferRoom = room;
    bufferRoom.disable = false;
    put(bufferRoom);
};
// created saga
const post = (values) => {
    axios
        .post(ROOM_URL, values)
        .then((res) => {
            store.dispatch(addRoom(res.data));
            resetFormHandler(ROOM_FORM);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_ROOM_LABEL),
                    actionType: i18n.t(CREATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
// created saga
export const createRoomService = (values) => {
    const { id, name, type } = values;
    if (id) {
        put({ id, name, type });
    } else {
        post({ name, type });
    }
};

export const selectOneRoomService = (roomId) => {
    store.dispatch(selectOneRoom(roomId));
};

export const clearRoomOneService = () => {
    store.dispatch(clearRoomOne());
    resetFormHandler(ROOM_FORM);
};
