import { store } from '../store';

import { ROOM_FORM_TYPE } from '../constants/reduxForms';
import { ROOM_TYPES_URL } from '../constants/axios';
import axios from '../helper/axios';
import {
    getAllRoomTypesSuccess,
    deleteRoomTypeSuccess,
    updateRoomTypeSuccess,
    addRoomTypeSuccess,
    selectRoomType,
} from '../actions/rooms';

import i18n from '../i18n';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_ROOM_LABEL, FORM_TYPE_LABEL } from '../constants/translationLabels/formElements';
// created saga
export const getAllRoomTypesService = () => {
    axios
        .get(ROOM_TYPES_URL)
        .then((res) => {
            store.dispatch(getAllRoomTypesSuccess(res.data));
        })
        .catch((error) => errorHandler(error));
};
// created saga
export const deleteTypeService = (roomTypeId) => {
    axios
        .delete(`${ROOM_TYPES_URL}/${roomTypeId}`)
        .then(() => {
            store.dispatch(deleteRoomTypeSuccess(roomTypeId));
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: `${i18n.t(FORM_ROOM_LABEL)} ${i18n.t(FORM_TYPE_LABEL)}`,
                    actionType: i18n.t(DELETED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
// created saga
export const putNewType = (values) => {
    axios
        .put(ROOM_TYPES_URL, values)
        .then((response) => {
            store.dispatch(updateRoomTypeSuccess(response.data));
            resetFormHandler(ROOM_FORM_TYPE);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: `${i18n.t(FORM_ROOM_LABEL)} ${i18n.t(FORM_TYPE_LABEL)}`,
                    actionType: i18n.t(UPDATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
// created saga
export const postNewType = (values) => {
    axios
        .post(ROOM_TYPES_URL, values)
        .then((response) => {
            store.dispatch(addRoomTypeSuccess(response.data));
            resetFormHandler(ROOM_FORM_TYPE);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: `${i18n.t(FORM_ROOM_LABEL)} ${i18n.t(FORM_TYPE_LABEL)}`,
                    actionType: i18n.t(CREATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
// created saga
export const addNewTypeService = (values) => {
    if (values.id) {
        putNewType(values);
    } else {
        postNewType(values);
    }
};
// used action in component directly
export const getOneNewTypeService = (roomId) => {
    store.dispatch(selectRoomType(roomId));
};
