import { store } from '../store';

import axios from '../helper/axios';
import { DISABLED_GROUPS_URL, GROUP_URL } from '../constants/axios';
import {
    BACK_END_SUCCESS_OPERATION,
    GROUP_LABEL,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/services';
import { GROUP_FORM } from '../constants/reduxForms';
import {
    showAllGroups,
    deleteGroup,
    addGroup,
    selectGroup,
    updateGroup,
    clearGroup,
    setDisabledGroups,
} from '../actions/index';
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

export const createGroupService = (data) => {
    axios
        .post(GROUP_URL, data)
        .then((response) => {
            store.dispatch(addGroup(response.data));
            resetFormHandler(GROUP_FORM);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(GROUP_LABEL),
                    actionType: i18n.t(CREATED_LABEL),
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

export const showAllGroupsService = () => {
    axios
        .get(GROUP_URL)
        .then((response) => {
            store.dispatch(showAllGroups(response.data.sort((a, b) => sortGroup(a, b))));
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
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(GROUP_LABEL),
                    actionType: i18n.t(UPDATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const handleGroupService = (values) => {
    if (values.id) updateGroupService(values);
    else createGroupService(values);
};

export const clearGroupService = () => {
    store.dispatch(clearGroup());
    resetFormHandler(GROUP_FORM);
};

export const removeGroupCardService = (groupId) => {
    axios
        .delete(`${GROUP_URL}/${groupId}`)
        .then(() => {
            store.dispatch(deleteGroup(groupId));
            getDisabledGroupsService();
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(GROUP_LABEL),
                    actionType: i18n.t(DELETED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const setDisabledGroupService = (group) => {
    group.disable = true;
    updateGroupService(group);
};

export const setEnabledGroupService = (group) => {
    group.disable = false;
    updateGroupService(group);
};
