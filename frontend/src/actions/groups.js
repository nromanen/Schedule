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

export const fetchGroupByIdSuccess = (group) => {
    return {
        type: actionTypes.FETCH_GROUP_BY_ID_SUCCESS,
        group,
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

export const clearGroupSuccess = () => {
    return {
        type: actionTypes.CLEAR_GROUP_SUCCESS,
    };
};

export const fetchDisabledGroupsStart = () => {
    return {
        type: actionTypes.FETCH_DISABLED_GROUPS_START,
    };
};

export const fetchEnabledGroupsStart = () => {
    return {
        type: actionTypes.FETCH_ENABLED_GROUPS_START,
    };
};

export const fetchGroupByIdStart = (id) => {
    return {
        type: actionTypes.FETCH_GROUP_BY_ID_START,
        id,
    };
};

export const deleteGroupStart = (id) => {
    return {
        type: actionTypes.DELETE_GROUP_START,
        id,
    };
};

export const submitGroupStart = (group) => {
    return {
        type: actionTypes.SUBMIT_GROUP_START,
        group,
    };
};

export const clearGroupStart = () => {
    return {
        type: actionTypes.CLEAR_GROUP_START,
    };
};

export const toggleDisabledStatus = (groupId, disabledStatus) => {
    return {
        type: actionTypes.TOGGLE_DISABLED_STATUS_GROUP,
        groupId,
        disabledStatus,
    };
};
