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

// export const clearGroupService = () => {
//     store.dispatch(clearGroup());
//     resetFormHandler(GROUP_FORM);
// };

// export const getDisabledGroupsService = () => {
//     axios
//         .get(DISABLED_GROUPS_URL)
//         .then((res) => {
//             store.dispatch(setDisabledGroups(res.data.sort((a, b) => sortGroup(a, b))));
//         })
//         .catch((error) => {
//             errorHandler(error);
//         });
// };

// export const createGroupService = (data) => {
//     axios
//         .post(GROUP_URL, data)
//         .then((response) => {
//             store.dispatch(addGroup(response.data));
//             resetFormHandler(GROUP_FORM);
//             successHandler(
//                 i18n.t(BACK_END_SUCCESS_OPERATION, {
//                     cardType: i18n.t(FORM_GROUP_LABEL),
//                     actionType: i18n.t(CREATED_LABEL),
//                 }),
//             );
//         })
//         .catch((error) => errorHandler(error));
// };

// export const handleGroupService = (values) => {
//     if (values.id) updateGroupService(values);
//     else createGroupService(values);
// };

// export const removeGroupCardService = (groupId) => {
//     console.log(groupId);
//     console.log(`${GROUP_URL}/${groupId}`);
//     axios
//         .delete(`${GROUP_URL}/${groupId}`)
//         .then(() => {
//             store.dispatch(deleteGroup(groupId));
//             //getDisabledGroupsService();
//             successHandler(
//                 i18n.t(BACK_END_SUCCESS_OPERATION, {
//                     cardType: i18n.t(FORM_GROUP_LABEL),
//                     actionType: i18n.t(DELETED_LABEL),
//                 }),
//             );
//         })
//         .catch((error) => errorHandler(error));
// };

// export const setDisabledGroupService = (group) => {
//     const bufferGroup = group;
//     bufferGroup.disable = true;
//     updateGroupService(bufferGroup);
// };

// export const setEnabledGroupService = (group) => {
//     const bufferGroup = group;
//     bufferGroup.disable = false;
//     updateGroupService(bufferGroup);
// };
