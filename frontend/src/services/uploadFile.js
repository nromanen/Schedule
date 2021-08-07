import axios from '../helper/axios';
import { STUDENTS_TO_GROUP_FILE } from '../constants/axios';
import i18n from '../helper/i18n';
import { successHandler } from '../helper/handlerAxios';

export const uploadStudentsToGroupFile = (file,groupId) => {
    const formData = new FormData();
    formData.append("file", file);
    axios
        .post(`${STUDENTS_TO_GROUP_FILE}${groupId}`, formData)
        .then((res) => {
            console.log(res);
            successHandler(
                i18n.t('serviceMessages:file_backend_success_operation', {
                    cardType: i18n.t('formElements:students_file_label'),
                    actionType: i18n.t('serviceMessages:file_label')
                })
            );
        })
        .catch((err) => alert("File Upload Error"));
}