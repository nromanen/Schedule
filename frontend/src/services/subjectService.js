import { store } from '../redux';

import axios from '../helper/axios';
import { DISABLED_SUBJECTS_URL, SUBJECT_URL } from '../constants/axios';
import { SUBJECT_FORM } from '../constants/reduxForms';
import {
    addSubject,
    clearSubject,
    deleteSubject,
    selectSubject,
    setDisabledSubjects,
    showAllSubjects,
    updateSubject,
} from '../redux/actions/index';
import i18n from '../helper/i18n';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';

export const selectSubjectService = (subjectId) => store.dispatch(selectSubject(subjectId));

export const handleSubjectService = (values) =>
    values.id ? updateSubjectService(values) : createSubjectService(values);

export const clearSubjectService = () => {
    store.dispatch(clearSubject());
    resetFormHandler(SUBJECT_FORM);
};

export const showAllSubjectsService = () => {
    axios
        .get(SUBJECT_URL)
        .then((response) => {
            store.dispatch(showAllSubjects(response.data));
        })
        .catch((error) => errorHandler(error));
};

export const removeSubjectCardService = (subjectId) => {
    axios
        .delete(`${SUBJECT_URL}/${subjectId}`)
        .then((response) => {
            store.dispatch(deleteSubject(subjectId));
            getDisabledSubjectsService();
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:subject_label'),
                    actionType: i18n.t('serviceMessages:deleted_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const createSubjectService = (data) => {
    axios
        .post(SUBJECT_URL, data)
        .then((response) => {
            store.dispatch(addSubject(response.data));
            resetFormHandler(SUBJECT_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:subject_label'),
                    actionType: i18n.t('serviceMessages:created_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const updateSubjectService = (data) => {
    return axios
        .put(SUBJECT_URL, data)
        .then((response) => {
            store.dispatch(updateSubject(response.data));
            selectSubjectService(null);
            showAllSubjectsService();
            getDisabledSubjectsService();
            resetFormHandler(SUBJECT_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:subject_label'),
                    actionType: i18n.t('serviceMessages:updated_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const getDisabledSubjectsService = () => {
    axios
        .get(DISABLED_SUBJECTS_URL)
        .then((res) => {
            store.dispatch(setDisabledSubjects(res.data));
        })
        .catch((error) => errorHandler(error));
};

export const setDisabledSubjectsService = (subject) => {
    subject.disable = true;
    updateSubjectService(subject);
};

export const setEnabledSubjectsService = (subject) => {
    subject.disable = false;
    updateSubjectService(subject);
};
