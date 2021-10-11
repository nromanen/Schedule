import axios from '../helper/axios';
import { DEPARTMENT_URL, SUBJECT_URL } from '../constants/axios';
import { store } from '../store';

import { addSubject } from '../actions';
import { resetFormHandler } from '../helper/formHelper';
import { DEPARTMENT_FORM, SUBJECT_FORM } from '../constants/reduxForms';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import i18n from '../helper/i18n';
import {
    addDepartment,
    clearDepartmentForm,
    deleteDepartment,
    getAllDepartments,
    getDepartItemById,
    getDisabledDepartments,
    setDisabledDepartment,
    setEnabledDepartment,
    updateDepart,
} from '../actions/departments';

export const createDepartmentService = (data) => {
    axios
        .post(DEPARTMENT_URL, data)
        .then((response) => {
            store.dispatch(addDepartment(response.data));
            resetFormHandler(DEPARTMENT_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:department_label'),
                    actionType: i18n.t('serviceMessages:created_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const getAllDepartmentsService = () => {
    axios
        .get(DEPARTMENT_URL)
        .then((response) => {
            store.dispatch(getAllDepartments(response.data));
        })
        .catch((error) => errorHandler(error));
};
export const getDisabledDepartmentsService = () => {
    axios
        .get(`${DEPARTMENT_URL}/disabled`)
        .then((response) => {
            store.dispatch(getDisabledDepartments(response.data));
        })
        .catch((error) => errorHandler(error));
};
export const setDisabledDepartmentService = (data) => {
    axios
        .put(`${DEPARTMENT_URL}`, data)
        .then((response) => {
            store.dispatch(setDisabledDepartment(response.data));
        })
        .catch((error) => errorHandler(error));
};
export const setEnabledDepartmentService = (data) => {
    axios
        .put(`${DEPARTMENT_URL}`, data)
        .then((response) => {
            store.dispatch(setEnabledDepartment(response.data));
        })
        .catch((error) => errorHandler(error));
};
export const updateDepartmentService = (data) => {
    axios
        .put(`${DEPARTMENT_URL}`, data)
        .then((response) => {
            store.dispatch(updateDepart(response.data));
            resetFormHandler(DEPARTMENT_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:department_label'),
                    actionType: i18n.t('serviceMessages:updated_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
export const deleteDepartmentsService = (id) => {
    axios
        .delete(`${DEPARTMENT_URL}/${id}`)
        .then((response) => {
            store.dispatch(deleteDepartment(response.data));
        })
        .catch((error) => errorHandler(error));
};
export const clearDepartment = () => {
    store.dispatch(clearDepartmentForm());
    resetFormHandler(DEPARTMENT_FORM);
};
export const getDepartmentByIdService = (id) => {
    store.dispatch(getDepartItemById(Number(id)));
};
