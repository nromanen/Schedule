import axios from '../helper/axios';
import { STUDENT_URL, SUBJECT_URL } from '../constants/axios';
import { store } from '../index';
import { addSubject } from '../redux/actions';
import { resetFormHandler } from '../helper/formHelper';
import { STUDENT_FORM, SUBJECT_FORM } from '../constants/reduxForms';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import i18n from '../helper/i18n';
import { addStudent } from '../redux/actions/students';

export const createStudentService = data => {
    axios
        .post(STUDENT_URL, data)
        .then(response => {
            store.dispatch(addStudent(response.data));
            resetFormHandler(STUDENT_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:student_label'),
                    actionType: i18n.t('serviceMessages:created_label')
                })
            );
        })
        .catch(error => errorHandler(error));
};