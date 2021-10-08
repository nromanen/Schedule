import axios from '../helper/axios';
import { STUDENT_URL, SUBJECT_URL } from '../constants/axios';
import { store } from '../redux';

import { addSubject, deleteSubject, selectGroup, updateSubject } from '../redux/actions';
import { resetFormHandler } from '../helper/formHelper';
import { STUDENT_FORM, SUBJECT_FORM } from '../constants/reduxForms';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import i18n from '../helper/i18n';
import {
    addStudent,
    deleteStudent,
    setStudent,
    showAllStudents,
    showAllStudentsByGroupId,
    updateStudent,
} from '../redux/actions/students';
import {
    getDisabledSubjectsService,
    selectSubjectService,
    showAllSubjectsService,
} from './subjectService';

export const createStudentService = (data) => {
    axios
        .post(STUDENT_URL, data)
        .then((response) => {
            store.dispatch(addStudent(response.data));
            resetFormHandler(STUDENT_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:student_a_label'),
                    actionType: i18n.t('serviceMessages:created_label'),
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
        .then((response) => {
            store.dispatch(deleteStudent(student.id));
            getAllStudentsByGroupId(student.group.id);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:student_a_label'),
                    actionType: i18n.t('serviceMessages:deleted_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
export const updateStudentService = (data) => {
    return axios
        .put(STUDENT_URL, data)
        .then((response) => {
            store.dispatch(updateStudent(response.data));
            selectStudentService(null);
            getAllStudentsByGroupId(data.prevGroup.id);
            resetFormHandler(STUDENT_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:student_a_label'),
                    actionType: i18n.t('serviceMessages:updated_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
export const selectStudentService = (studentId) => store.dispatch(setStudent(studentId));
