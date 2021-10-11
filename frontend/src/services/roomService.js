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

import i18n from '../helper/i18n';

export const showListOfRoomsService = () => {
    axios
        .get(ROOM_URL)
        .then((response) => {
            const bufferArray = [];
            const results = response.data;
            for (const key in results) {
                bufferArray.push({
                    id: key,
                    ...results[key],
                });
            }
            store.dispatch(showListOfRooms(bufferArray));
        })
        .catch((error) => errorHandler(error));
};

export const deleteRoomCardService = (id) => {
    axios
        .delete(`${ROOM_URL}/${id}`)
        .then((res) => {
            store.dispatch(deleteRoom(id));
            getDisabledRoomsService();
            showListOfRoomsService();
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:room_label'),
                    actionType: i18n.t('serviceMessages:deleted_label'),
                }),
            );
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

export const setDisabledRoomsService = (room) => {
    room.disable = true;
    put(room);
};

export const setEnabledRoomsService = (room) => {
    room.disable = false;
    put(room);
};

const put = (values) => {
    axios
        .put(ROOM_URL, values)
        .then((result) => {
            store.dispatch(updateOneRoom(result.data));
            resetFormHandler(ROOM_FORM);
            getDisabledRoomsService();
            showListOfRoomsService();
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:room_label'),
                    actionType: i18n.t('serviceMessages:updated_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
const post = (values) => {
    axios
        .post(ROOM_URL, values)
        .then((res) => {
            store.dispatch(addRoom(res.data));
            resetFormHandler(ROOM_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:room_label'),
                    actionType: i18n.t('serviceMessages:created_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const createRoomService = (values) => {
    if (values.id) {
        const newValue = {
            id: values.id,
            name: values.name,
            type: { id: +values.type, description: values.typeDescription },
        };
        put(newValue);
    } else {
        const newValue = {
            name: values.name,
            type: { id: +values.type, description: values.typeDescription },
        };

        post(newValue);
    }
};

export const selectOneRoomService = (roomId) => {
    store.dispatch(selectOneRoom(roomId));
};

export const clearRoomOneService = () => {
    store.dispatch(clearRoomOne());
    resetFormHandler(ROOM_FORM);
};
