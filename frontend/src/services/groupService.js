import { store } from '../store';

import axios from '../helper/axios';
import { GROUP_URL } from '../constants/axios';
import { GROUP_FORM } from '../constants/reduxForms';
import { showAllGroups, selectGroup, updateGroupSusses } from '../actions/index';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import i18n from '../i18n';
import { resetFormHandler } from '../helper/formHelper';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_GROUP_LABEL } from '../constants/translationLabels/formElements';
import { sortGroup } from '../helper/sortGroup';

export const showAllGroupsService = () => {
    axios
        .get(GROUP_URL)
        .then((response) => {
            store.dispatch(showAllGroups(response.data.sort((a, b) => sortGroup(a, b))));
        })
        .catch((error) => errorHandler(error));
};

export const selectGroupService = (groupId) => {
    store.dispatch(selectGroup(groupId));
};

export const updateGroupService = (data) => {
    return axios
        .put(GROUP_URL, data)
        .then((response) => {
            store.dispatch(updateGroupSusses(response.data));
            selectGroupService(null);
            // getDisabledGroupsService();
            // showAllGroupsService();
            resetFormHandler(GROUP_FORM);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_GROUP_LABEL),
                    actionType: i18n.t(UPDATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
