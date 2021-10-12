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
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels';
import { FORM_CLASS_LABEL } from '../constants/translationLabels/formElements';

export const getClassScheduleListService = () => {
    axios
        .get(CLASS_URL)
        .then((response) => {
            const results = response.data;
            store.dispatch(setClassScheduleList(results));
            setLoadingService(false);
        })
        .catch((error) => errorHandler(error));
};

export const getPublicClassScheduleListService = () => {
    axios
        .get(PUBLIC_CLASSES_URL)
        .then((response) => {
            const results = response.data;
            store.dispatch(setClassScheduleList(results));
        })
        .catch((error) => {
            errorHandler(error);
            setLoadingService(false);
        });
};

export const putAddClassScheduleOneService = (values) => {
    axios
        .put(CLASS_URL, values)
        .then((response) => {
            store.dispatch(updateClassScheduleOne(response.data));
            resetFormHandler(CLASS_FORM);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_CLASS_LABEL),
                    actionType: i18n.t(UPDATED_LABEL),
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
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_CLASS_LABEL),
                    actionType: i18n.t(CREATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const addClassScheduleOneService = (values) => {
    if (values.id) {
        putAddClassScheduleOneService(values);
    } else {
        postAddClassScheduleOneService(values);
    }
};

export const getClassScheduleOneService = (classId) => {
    store.dispatch(getClassScheduleOne(classId));
};

export const deleteClassScheduleOneService = (classId) => {
    axios
        .delete(`${CLASS_URL}/${classId}`)
        .then(() => {
            store.dispatch(deleteClassScheduleOne(classId));
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_CLASS_LABEL),
                    actionType: i18n.t(DELETED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const clearClassScheduleOneService = () => {
    store.dispatch(clearClassScheduleOne());
    resetFormHandler(CLASS_FORM);
};
