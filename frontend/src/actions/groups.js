import * as actionTypes from './actionsType';

export const getAllPublicGroupsStart = (id) => ({
    type: actionTypes.GET_ALL_PUBLIC_GROUPS_START,
    id,
});

export const selectGroupSuccess = (id) => ({
    type: actionTypes.SELECT_GROUP_SUCCESS,
    id,
});

export const getGroupsForCurrentSemesterStart = () => ({
    type: actionTypes.GET_GROUPS_FOR_CURRENT_SEMESTER_START,
});

export const showAllGroupsSuccess = (payload) => ({
    type: actionTypes.SHOW_ALL_GROUPS_SUCCESS,
    payload,
});

export const setScheduleGroups = (payload) => ({
    type: actionTypes.SET_SCHEDULE_GROUPS,
    payload,
});