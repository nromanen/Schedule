import axios from '../helper/axios';
import { store } from '../index';

import {
    MERGE_USER_AND_TEACHER_URL,
    USERS_URL,
    USER_PROFILE,
    UPDATE_USER_PROFILE
} from '../constants/axios';
import { setUsers, setUser, setTeacher } from '../redux/actions/index';

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

export const getUserProfile = () => {
    axios
        .get(USER_PROFILE)
        .then(response => {
            store.dispatch(setUser(response.data));
            if (response.data.teacher_name) {
                store.dispatch(
                    setTeacher({
                        id: 15,
                        name: response.data.teacher_name,
                        surname: response.data.teacher_surname,
                        patronymic: response.data.teacher_patronymic,
                        position: response.data.teacher_position
                    })
                );
            }
        })
        .catch(error => errorHandler(error));
};

export const updateUserPassword = values => {
    axios
        .put(UPDATE_USER_PROFILE, {
            current_password: values.current_password,
            new_password: values.new_password
        })
        .then(response => {
            store.dispatch(setUser(response.data));
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:teacher_label'),
                    actionType: i18n.t('serviceMessages:updated')
                })
            );
        })
        .catch(error => errorHandler(error));
};
export const updateUserTeacher = values => {
    axios
        .put(UPDATE_USER_PROFILE, {
            teacher_name: values.name,
            teacher_surname: values.surname,
            teacher_patronymic: values.patronymic,
            teacher_position: values.position
        })
        .then(response => {
            store.dispatch(setUser(response.data));
            store.dispatch(
                setTeacher({
                    id: 15,
                    name: response.data.teacher_name,
                    surname: response.data.teacher_surname,
                    patronymic: response.data.teacher_patronymic,
                    position: response.data.teacher_position
                })
            );
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:user_label'),
                    actionType: i18n.t('serviceMessages:updated')
                })
            );
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
