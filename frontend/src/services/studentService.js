import axios from '../helper/axios';
import { STUDENT_URL } from '../constants/axios';
import { store } from '../store';

import { resetFormHandler } from '../helper/formHelper';
import { STUDENT_FORM } from '../constants/reduxForms';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import i18n from '../i18n';
import {
    createStudent,
    deleteStudent,
    setStudent,
    showAllStudents,
    showAllStudentsByGroupId,
    updateStudent,
} from '../actions/students';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_STUDENT_LABEL } from '../constants/translationLabels/formElements';

export const createStudentService = (data) => {
    axios
        .post(STUDENT_URL, data)
        .then((response) => {
            store.dispatch(createStudent(response.data));
            resetFormHandler(STUDENT_FORM);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_STUDENT_LABEL),
                    actionType: i18n.t(CREATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const getAllStudentsByGroupId = (groupId) => {
    axios
        .get(STUDENT_URL)
        .then((response) => {
            const result = response.data.filter(({ group }) => group.id === groupId);
            store.dispatch(showAllStudentsByGroupId(result));
        })
        .catch((error) => errorHandler(error));
};

export const getAllStudentsService = () => {
    axios
        .get(STUDENT_URL)
        .then((response) => {
            store.dispatch(showAllStudents(response.data));
        })
        .catch((error) => errorHandler(error));
};

export const deleteStudentService = (student) => {
    axios
        .delete(`${STUDENT_URL}/${student.id}`)
        .then(() => {
            store.dispatch(deleteStudent(student.id));
            getAllStudentsByGroupId(student.group.id);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_STUDENT_LABEL),
                    actionType: i18n.t(DELETED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const selectStudentService = (studentId) => store.dispatch(setStudent(studentId));

export const updateStudentService = (data) => {
    return axios
        .put(STUDENT_URL, data)
        .then((response) => {
            store.dispatch(updateStudent(response.data));
            selectStudentService(null);
            getAllStudentsByGroupId(data.prevGroup.id);
            resetFormHandler(STUDENT_FORM);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_STUDENT_LABEL),
                    actionType: i18n.t(UPDATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
