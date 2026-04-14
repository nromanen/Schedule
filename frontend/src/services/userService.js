import axios from '../helper/axios';
import {store} from '../store';
import {UPDATE_USER_PROFILE, USER_PROFILE, USERS_URL,} from '../constants/axios';
import {setTeacher, setUser, setUsers} from '../actions/index';

import i18n from '../i18n';
import {errorHandler, successHandler} from '../helper/handlerAxios';
import {BACK_END_SUCCESS_OPERATION,} from '../constants/translationLabels/serviceMessages';
import {FORM_TEACHER_LABEL, FORM_USER_LABEL} from '../constants/translationLabels/formElements';

export const getUserProfile = () => {
    axios
        .get(USER_PROFILE)
        .then((response) => {
            store.dispatch(setUser(response.data));
            if (response.data.name) {
                store.dispatch(
                    setTeacher({
                        id: response.data.id,
                        name: response.data.name,
                        surname: response.data.surname,
                        patronymic: response.data.patronymic,
                        position: response.data.position,
                        department: response.data.department,
                    }),
                );
            }
        })
        .catch((error) => errorHandler(error));
};

export const updateUserPassword = (values) => {
    axios
        .put(UPDATE_USER_PROFILE, {
            current_password: values.current_password,
            new_password: values.new_password,
        })
        .then((response) => {
            store.dispatch(setUser(response.data));
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_TEACHER_LABEL),
                    actionType: i18n.t('serviceMessages:updated'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};


