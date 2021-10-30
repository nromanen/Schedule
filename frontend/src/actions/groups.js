import * as actionTypes from './actionsType';

export const addGroup = (res) => {
    return {
        type: actionTypes.ADD_GROUP,
        result: res,
    };
};

export const updateGroupSusses = (res) => {
    return {
        type: actionTypes.UPDATE_GROUP,
        result: res,
    };
};

export const showAllGroups = (res) => {
    return {
        type: actionTypes.SHOW_ALL_GROUPS,
        result: res,
    };
};

export const deleteGroupSusses = (res) => {
    return {
        type: actionTypes.DELETE_GROUP,
        result: res,
    };
};

export const selectGroup = (res) => {
    return {
        type: actionTypes.SELECT_GROUP,
        result: res,
    };
};

export const clearGroupSusses = () => ({
    type: actionTypes.CLEAR_GROUP,
});

export const fetchDisabledGroupsStart = () => ({
    type: actionTypes.FETCH_DISABLED_GROUPS_START,
});

export const fetchEnabledGroupsStart = () => ({
    type: actionTypes.FETCH_ENABLED_GROUPS_START,
});

export const deleteGroupStart = (id) => ({
    type: actionTypes.DELETE_GROUP_START,
    id,
});

export const submitGroupStart = (data) => ({
    type: actionTypes.SUBMIT_GROUP_START,
    data,
});

// export const updateGroupStart = (data) => ({
//     type: actionTypes.UPDATE_GROUP_START,
//     data,
// });

export const clearGroupStart = (data) => ({
    type: actionTypes.CLEAR_GROUP_START,
    data,
});

export const toggleDisabledStatus = (groupId, disabledStatus) => ({
    type: actionTypes.TOGGLE_DISABLED_STATUS_GROUP,
    groupId,
    disabledStatus,
});
