import { store } from '../store';

import { ROOM_FORM_TYPE } from '../constants/reduxForms';
import { ROOM_TYPES_URL } from '../constants/axios';
import axios from '../helper/axios';

import {
    getAllRoomTypes,
    deleteType,
    updateOneType,
    postOneType,
    getOneNewType,
} from '../actions/roomTypes';

import i18n from '../helper/i18n';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';

export const getAllRoomTypesService = () => {
    axios
        .get(ROOM_TYPES_URL)
        .then((res) => {
            store.dispatch(getAllRoomTypes(res.data));
        })
        .catch((error) => errorHandler(error));
};

export const deleteTypeService = (roomTypeId) => {
    axios
        .delete(`${ROOM_TYPES_URL}/${roomTypeId}`)
        .then((response) => {
            store.dispatch(deleteType(roomTypeId));
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: `${i18n.t('formElements:room_label')} ${i18n.t(
                        'formElements:type_label',
                    )}`,
                    actionType: i18n.t('serviceMessages:deleted_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const addNewTypeService = (values) => {
    if (values.id) {
        putNewType(values);
    } else {
        postNewType(values);
    }
};

export const putNewType = (values) => {
    axios
        .put(ROOM_TYPES_URL, values)
        .then((response) => {
            store.dispatch(updateOneType(response.data));
            resetFormHandler(ROOM_FORM_TYPE);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: `${i18n.t('formElements:room_label')} ${i18n.t(
                        'formElements:type_label',
                    )}`,
                    actionType: i18n.t('serviceMessages:updated_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const postNewType = (values) => {
    axios
        .post(ROOM_TYPES_URL, values)
        .then((response) => {
            store.dispatch(postOneType(response.data));
            resetFormHandler(ROOM_FORM_TYPE);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: `${i18n.t('formElements:room_label')} ${i18n.t(
                        'formElements:type_label',
                    )}`,
                    actionType: i18n.t('serviceMessages:created_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const getOneNewTypeService = (roomId) => {
    store.dispatch(getOneNewType(roomId));
};
