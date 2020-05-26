import axios from '../helper/axios';
import { store } from '../index';

import { MERGE_USER_AND_TEACHER_URL, USERS_URL } from '../constants/axios';
import { setUsers } from '../redux/actions/index';

import i18n from '../helper/i18n';
import { setLoadingService } from './loadingService';
import { getTeachersWithoutAccount } from './teacherService';
import { errorHandler, successHandler } from '../helper/handlerAxios';

export const getUsersService = () => {
    axios
        .get(USERS_URL)
        .then(response => {
            store.dispatch(setUsers(response.data));
        })
        .catch(error => errorHandler(error));
};

export const mergeUserAndTeacherService = mergeObj => {
    axios
        .put(MERGE_USER_AND_TEACHER_URL, mergeObj)
        .then(response => {
            getTeachersWithoutAccount();
            getUsersService();
            setLoadingService(false);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:user_label'),
                    actionType: i18n.t('serviceMessages:successfully_merged')
                })
            );
        })
        .catch(error => {
            setLoadingService(false);
            errorHandler(error);
        });
};
