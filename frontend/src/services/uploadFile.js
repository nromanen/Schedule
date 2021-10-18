import axios from '../helper/axios';
import { STUDENTS_TO_GROUP_FILE } from '../constants/axios';
import i18n from '../i18n';
import { successHandler } from '../helper/handlerAxios';
import {
    FILE_LABEL,
    FILE_BACK_END_SUCCESS_OPERATION,
} from '../constants/translationLabels/serviceMessages';
import {
    FORM_STUDENT_FILE_LABEL,
    FORM_STUDENTS_FILE_LABEL,
} from '../constants/translationLabels/formElements';

export const uploadStudentsToGroupFile = (file, groupId) => {
    const formData = new FormData();
    formData.append('file', file);
    axios
        .post(`${STUDENTS_TO_GROUP_FILE}${groupId}`, formData)
        .then((res) => {
            let students = res.data.length;
            students +=
                students !== 1
                    ? ` ${i18n.t(FORM_STUDENTS_FILE_LABEL)}`
                    : ` ${i18n.t(FORM_STUDENT_FILE_LABEL)}`;
            successHandler(
                i18n.t(FILE_BACK_END_SUCCESS_OPERATION, {
                    cardType: students,
                    actionType: i18n.t(FILE_LABEL),
                }),
            );
        })
        .catch(() => alert('File Upload Error'));
};
