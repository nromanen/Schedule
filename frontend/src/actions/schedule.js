import * as actionTypes from './actionsType';

export const setScheduleItems = (res) => {
    return {
        type: actionTypes.SET_SCHEDULE_ITEMS,
        result: res,
    };
};

export const getScheduleItemsRequested = (semesterId) => {
    return {
        type: actionTypes.GET_SCHEDULE_ITEMS_REQUESTED,
        semesterId,
    };
};
export const getAllPublicTeachersByDepartmentRequested = (departmentId) => {
    return {
        type: actionTypes.GET_ALL_PUBLIC_TEACHERS_BY_DEPARTMENT_REQUESTED,
        departmentId,
    };
};

export const setCurrentSemester = (res) => {
    return {
        type: actionTypes.SET_CURRENT_SEMESTER,
        payload: res,
    };
};
export const getAllPublicTeachersRequested = () => {
    return {
        type: actionTypes.GET_ALL_PUBLIC_TEACHERS_REQUESTED,
    };
};
export const getAllPublicSemestersRequested = () => {
    return {
        type: actionTypes.GET_ALL_PUBLIC_SEMESTERS_REQUESTED,
    };
};
export const getAllScheduleItemsRequested = () => {
    return {
        type: actionTypes.GET_ALL_SCHEDULE_ITEMS_REQUESTED,
    };
};
export const addItemsToScheduleRequested = (item) => {
    return {
        type: actionTypes.ADD_ITEM_TO_SCHEDULE_REQUESTED,
        item,
    };
};
export const editRoomItemToScheduleRequested = (item) => {
    return {
        type: actionTypes.EDIT_ITEM_TO_SCHEDULE_REQUESTED,
        item,
    };
};
export const deleteScheduleItemRequested = (itemId) => {
    return {
        type: actionTypes.DELETE_SCHEDULE_ITEM_REQUESTED,
        itemId,
    };
};
export const clearScheduleRequested = (semesterId) => {
    return {
        type: actionTypes.CLEAR_SCHEDULE_REQUESTED,
        semesterId,
    };
};
export const getAllPublicGroupsRequested = (id) => {
    return {
        type: actionTypes.GET_ALL_PUBLIC_GROUPS_REQUESTED,
        id,
    };
};
export const sendTeacherScheduleRequested = (data) => {
    return {
        type: actionTypes.SEND_TEACHER_SCHEDULE_REQUESTED,
        data,
    };
};
export const getTeacherRangeScheduleRequested = (values) => {
    return {
        type: actionTypes.GET_TEACHER_RANGE_SCHEDULE_REQUESTED,
        values,
    };
};

export const getCurrentSemesterRequsted = () => {
    return {
        type: actionTypes.GET_CURRENT_SEMESTER_REQUESTED,
    };
};

export const setDefaultSemester = (res) => {
    return {
        type: actionTypes.SET_DEFAULT_SEMESTER,
        payload: res,
    };
};

export const getDefaultSemesterRequsted = () => {
    return {
        type: actionTypes.GET_DEFAULT_SEMESTER_REQUESTED,
    };
};

export const addItemToSchedule = (res) => {
    return {
        type: actionTypes.ADD_ITEM_TO_SCHEDULE,
        result: res,
    };
};

export const checkAvailabilitySchedule = (res) => {
    return {
        type: actionTypes.CHECK_AVAILABILITY_SCHEDULE,
        result: res,
    };
};

export const checkAvailabilityScheduleRequested = (item) => {
    return {
        type: actionTypes.CHECK_AVAILABILITY_SCHEDULE_REQUESTED,
        item,
    };
};
export const checkAvailabilityChangeRoomScheduleRequested = (item) => {
    return {
        type: actionTypes.CHECK_AVAILABILITY_CHANGE_ROOM_SCHEDULE_REQUESTED,
        item,
    };
};

export const setFullSchedule = (result) => {
    return {
        type: actionTypes.SET_FULL_SCHEDULE,
        result,
    };
};
export const setItemGroupId = (res) => {
    return {
        type: actionTypes.SET_ITEM_GROUP_ID,
        result: res,
    };
};

export const setGroupSchedule = (result) => {
    return {
        type: actionTypes.SET_GROUP_SCHEDULE,
        result,
    };
};
export const getGroupScheduleRequested = (groupId, semesterId) => {
    return {
        type: actionTypes.GET_GROUP_SCHEDULE_REQUESTED,
        groupId,
        semesterId,
    };
};
export const getTeacherScheduleRequested = (teacherId, semesterId) => {
    return {
        type: actionTypes.GET_TEACHER_SCHEDULE_REQUESTED,
        teacherId,
        semesterId,
    };
};
export const deleteItemFromSchedule = (res) => {
    return {
        type: actionTypes.DELETE_ITEM_FROM_SCHEDULE,
        result: res,
    };
};

export const setScheduleType = (result) => {
    return {
        type: actionTypes.SET_SCHEDULE_TYPE,
        newType: result,
    };
};

export const setScheduleGroupId = (groupId) => {
    return {
        type: actionTypes.SET_SCHEDULE_GROUP_ID,
        groupId,
    };
};

export const setScheduleTeacherId = (teacherId) => {
    return {
        type: actionTypes.SET_SCHEDULE_TEACHER_ID,
        teacherId,
    };
};
export const setTeacherSchedule = (result) => {
    return {
        type: actionTypes.SET_TEACHER_SCHEDULE,
        result,
    };
};

export const setSemesterList = (result) => {
    return {
        type: actionTypes.SET_SEMESTER_LIST,
        result,
    };
};
export const setScheduleSemesterId = (semesterId) => {
    return {
        type: actionTypes.SET_SCHEDULE_SEMESTER_ID,
        semesterId,
    };
};

export const setTeacherRangeSchedule = (result) => {
    return {
        type: actionTypes.SET_TEACHER_RANGE_SCHEDULE,
        result,
    };
};

export const setTeacherViewType = (type) => {
    return {
        type: actionTypes.SET_TEACHER_VIEW_TYPE,
        result: type,
    };
};
