import * as actionTypes from './actionsType';

export const showAllGroupsSuccess = (res) => ({
    type: actionTypes.SHOW_ALL_GROUPS_SUCCESS,
    res,
});

export const getGroupByIdSuccess = (group) => ({
    type: actionTypes.GET_GROUP_BY_ID_SUCCESS,
    group,
});

export const createGroupSuccess = (data) => ({
    type: actionTypes.CREATE_GROUP_SUCCESS,
    data,
});

export const updateGroupSuccess = (group) => ({
    type: actionTypes.UPDATE_GROUP_SUCCESS,
    group,
});

export const getAllPublicGroupsStart = (id) => ({
    type: actionTypes.GET_ALL_PUBLIC_GROUPS_START,
    id,
});

export const deleteGroupSuccess = (id) => ({
    type: actionTypes.DELETE_GROUP_SUCCESS,
    id,
});

export const selectGroupSuccess = (id) => ({
    type: actionTypes.SELECT_GROUP_SUCCESS,
    id,
});

export const clearGroupSuccess = () => ({
    type: actionTypes.CLEAR_GROUP_SUCCESS,
});

export const getDisabledGroupsStart = () => ({
    type: actionTypes.GET_DISABLED_GROUPS_START,
});

export const getEnabledGroupsStart = () => ({
    type: actionTypes.GET_ENABLED_GROUPS_START,
});

export const getGroupByIdStart = (id) => ({
    type: actionTypes.GET_GROUP_BY_ID_START,
    id,
});

export const deleteGroupStart = (id) => ({
    type: actionTypes.DELETE_GROUP_START,
    id,
});

export const submitGroupStart = (group) => ({
    type: actionTypes.SUBMIT_GROUP_START,
    group,
});

export const clearGroupStart = () => ({
    type: actionTypes.CLEAR_GROUP_START,
});

export const toggleDisabledStatus = (groupId, disabledStatus) => ({
    type: actionTypes.TOGGLE_DISABLED_STATUS_GROUP,
    groupId,
    disabledStatus,
});
