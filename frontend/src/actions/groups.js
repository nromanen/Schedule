import * as actionTypes from './actionsType';

export const createGroupSuccess = (res) => {
    return {
        type: actionTypes.CREATE_GROUP_SUCCESS,
        result: res,
    };
};

export const updateGroupSuccess = (res) => {
    return {
        type: actionTypes.UPDATE_GROUP_SUCCESS,
        result: res,
    };
};

export const showAllGroupsSuccess = (res) => {
    return {
        type: actionTypes.SHOW_ALL_GROUPS_SUCCESS,
        result: res,
    };
};

export const deleteGroupSuccess = (res) => {
    return {
        type: actionTypes.DELETE_GROUP_SUCCESS,
        result: res,
    };
};

export const selectGroupSuccess = (res) => {
    return {
        type: actionTypes.SELECT_GROUP_SUCCESS,
        result: res,
    };
};

export const clearGroupSuccess = () => ({
    type: actionTypes.CLEAR_GROUP_SUCCESS,
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

export const submitGroupStart = (group) => ({
    type: actionTypes.SUBMIT_GROUP_START,
    group,
});

export const clearGroupStart = (data) => ({
    type: actionTypes.CLEAR_GROUP_START,
    data,
});

export const toggleDisabledStatus = (groupId, disabledStatus) => ({
    type: actionTypes.TOGGLE_DISABLED_STATUS_GROUP,
    groupId,
    disabledStatus,
});
