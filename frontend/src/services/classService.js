import axios from '../helper/axios';
import { store } from '../index';
import { CLASS_URL, PUBLIC_CLASSES_URL } from '../constants/axios';

import { CLASS_FORM } from '../constants/reduxForms';

import {
    addClassScheduleOne,
    setClassScheduleList,
    getClassScheduleOne,
    deleteClassScheduleOne,
    updateClassScheduleOne,
    clearClassScheduleOne,
} from '../redux/actions/class';

import i18n from '../helper/i18n';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';
import { setLoadingService } from './loadingService';

export const getClassScheduleListService = (dispatch) => {
    axios
        .get(CLASS_URL)
        .then((response) => {
            const bufferArray = [];
            const results = response.data;
            for (const key in results) {
                bufferArray.push({
                    id: key,
                    ...results[key],
                });
            }
            store.dispatch(setClassScheduleList(bufferArray));
            setLoadingService(false);
        })
        .catch((error) => errorHandler(error));
};

export const getPublicClassScheduleListService = (dispatch) => {
    axios
        .get(PUBLIC_CLASSES_URL)
        .then((response) => {
            const bufferArray = [];
            const results = response.data;
            for (const key in results) {
                bufferArray.push({
                    id: key,
                    ...results[key],
                });
            }
            store.dispatch(setClassScheduleList(bufferArray));
        })
        .catch((error) => {
            errorHandler(error);
            setLoadingService(false);
        });
};

export const addClassScheduleOneService = (values) => {
    if (values.id) {
        putAddClassScheduleOneService(values);
    } else {
        postAddClassScheduleOneService(values);
    }
};

export const putAddClassScheduleOneService = (values) => {
    axios
        .put(CLASS_URL, values)
        .then((response) => {
            store.dispatch(updateClassScheduleOne(response.data));
            resetFormHandler(CLASS_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:class_label'),
                    actionType: i18n.t('serviceMessages:updated_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const postAddClassScheduleOneService = (values) => {
    axios
        .post(CLASS_URL, values)
        .then((response) => {
            store.dispatch(addClassScheduleOne(response.data));
            resetFormHandler(CLASS_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:class_label'),
                    actionType: i18n.t('serviceMessages:created_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const getClassScheduleOneService = (classId) => {
    store.dispatch(getClassScheduleOne(classId));
};

export const deleteClassScheduleOneService = (classId) => {
    axios
        .delete(`${CLASS_URL}/${classId}`)
        .then((response) => {
            store.dispatch(deleteClassScheduleOne(classId));
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:class_label'),
                    actionType: i18n.t('serviceMessages:deleted_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const clearClassScheduleOneService = () => {
    store.dispatch(clearClassScheduleOne());
    resetFormHandler(CLASS_FORM);
};
