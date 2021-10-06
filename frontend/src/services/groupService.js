import { reset } from 'redux-form';

import { store } from '../index';
import axios from '../helper/axios';
import { DISABLED_GROUPS_URL, GROUP_URL } from '../constants/axios';
import { GROUP_FORM } from '../constants/reduxForms';
import {
    showAllGroups,
    deleteGroup,
    addGroup,
    selectGroup,
    updateGroup,
    clearGroup,
    setDisabledGroups,
} from '../redux/actions/index';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import i18n from '../helper/i18n';
import { resetFormHandler } from '../helper/formHelper';

export const sortGroup = (a, b) => {
    return (
        Number(a.title.substr(0, a.title.indexOf(' '))) -
        Number(b.title.substr(0, b.title.indexOf(' ')))
    );
};

export const selectGroupService = (groupId) => {
    store.dispatch(selectGroup(groupId));
};

export const handleGroupService = (values) =>
    values.id ? updateGroupService(values) : createGroupService(values);

export const clearGroupService = () => {
    store.dispatch(clearGroup());
    resetFormHandler(GROUP_FORM);
};

export const showAllGroupsService = () => {
    axios
        .get(GROUP_URL)
        .then((response) => {
            store.dispatch(showAllGroups(response.data.sort((a, b) => sortGroup(a, b))));
        })
        .catch((error) => errorHandler(error));
};

export const removeGroupCardService = (groupId) => {
    axios
        .delete(`${GROUP_URL}/${groupId}`)
        .then((response) => {
            store.dispatch(deleteGroup(groupId));
            getDisabledGroupsService();
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:group_label'),
                    actionType: i18n.t('serviceMessages:deleted_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const createGroupService = (data) => {
    axios
        .post(GROUP_URL, data)
        .then((response) => {
            store.dispatch(addGroup(response.data));
            resetFormHandler(GROUP_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:group_label'),
                    actionType: i18n.t('serviceMessages:created_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const updateGroupService = (data) => {
    return axios
        .put(GROUP_URL, data)
        .then((response) => {
            store.dispatch(updateGroup(response.data));
            selectGroupService(null);
            getDisabledGroupsService();
            showAllGroupsService();
            resetFormHandler(GROUP_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:group_label'),
                    actionType: i18n.t('serviceMessages:updated_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const getDisabledGroupsService = () => {
    axios
        .get(DISABLED_GROUPS_URL)
        .then((res) => {
            store.dispatch(setDisabledGroups(res.data.sort((a, b) => sortGroup(a, b))));
        })
        .catch((error) => {
            errorHandler(error);
        });
};

export const setDisabledGroupService = (group) => {
    group.disable = true;
    updateGroupService(group);
};

export const setEnabledGroupService = (group) => {
    group.disable = false;
    updateGroupService(group);
};
