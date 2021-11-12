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

export const getAllPublicGroupsStart = (id) => {
    return {
        type: actionTypes.GET_ALL_PUBLIC_GROUPS_START,
        id,
    };
};

export const showAllGroupsSuccess = (res) => {
    return {
        type: actionTypes.SHOW_ALL_GROUPS_SUCCESS,
        result: res,
    };
};

export const getGroupByIdSuccess = (group) => {
    return {
        type: actionTypes.GET_GROUP_BY_ID_SUCCESS,
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

export const getDisabledGroupsStart = () => {
    return {
        type: actionTypes.GET_DISABLED_GROUPS_START,
    };
};

export const getEnabledGroupsStart = () => {
    return {
        type: actionTypes.GET_ENABLED_GROUPS_START,
    };
};

export const getGroupByIdStart = (id) => {
    return {
        type: actionTypes.GET_GROUP_BY_ID_START,
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
