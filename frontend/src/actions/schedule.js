import * as actionTypes from './actionsType';

export const getScheduleItemsStart = (semesterId) => {
    return {
        type: actionTypes.GET_SCHEDULE_ITEMS_START,
        semesterId,
    };
};
export const getScheduleItemsSuccess = (items) => {
    return {
        type: actionTypes.GET_SCHEDULE_ITEMS_SUCCESS,
        items,
    };
};

export const getAllPublicTeachersByDepartmentStart = (departmentId) => {
    return {
        type: actionTypes.GET_ALL_PUBLIC_TEACHERS_BY_DEPARTMENT_START,
        departmentId,
    };
};

export const getCurrentSemesterSuccess = (semester) => {
    return {
        type: actionTypes.GET_CURRENT_SEMESTER_SUCCESS,
        semester,
    };
};
export const getAllPublicTeachersStart = () => {
    return {
        type: actionTypes.GET_ALL_PUBLIC_TEACHERS_START,
    };
};
export const getAllPublicSemestersStart = () => {
    return {
        type: actionTypes.GET_ALL_PUBLIC_SEMESTERS_START,
    };
};

export const getAllPublicSemestersSuccess = (semesters) => {
    return {
        type: actionTypes.GET_ALL_PUBLIC_SEMESTERS_SUCCESS,
        semesters,
    };
};
export const getAllScheduleItemsStart = () => {
    return {
        type: actionTypes.GET_ALL_SCHEDULE_ITEMS_START,
    };
};
export const addItemsToScheduleStart = (item) => {
    return {
        type: actionTypes.ADD_ITEM_TO_SCHEDULE_START,
        item,
    };
};
export const editRoomItemToScheduleStart = (item) => {
    return {
        type: actionTypes.EDIT_ITEM_TO_SCHEDULE_START,
        item,
    };
};
export const deleteScheduleItemStart = (itemId) => {
    return {
        type: actionTypes.DELETE_SCHEDULE_ITEM_START,
        itemId,
    };
};

export const deleteScheduleItemSuccess = (itemId) => {
    return {
        type: actionTypes.DELETE_SCHEDULE_ITEM_SUCCESS,
        itemId,
    };
};
export const clearScheduleStart = (semesterId) => {
    return {
        type: actionTypes.CLEAR_SCHEDULE_START,
        semesterId,
    };
};
export const getAllPublicGroupsStart = (id) => {
    return {
        type: actionTypes.GET_ALL_PUBLIC_GROUPS_START,
        id,
    };
};
export const sendTeacherScheduleStart = (data) => {
    return {
        type: actionTypes.SEND_TEACHER_SCHEDULE_START,
        data,
    };
};
export const getTeacherRangeScheduleStart = (values) => {
    return {
        type: actionTypes.GET_TEACHER_RANGE_SCHEDULE_START,
        values,
    };
};

export const getCurrentSemesterRequsted = () => {
    return {
        type: actionTypes.GET_CURRENT_SEMESTER_START,
    };
};

export const getDefaultSemesterRequsted = () => {
    return {
        type: actionTypes.GET_DEFAULT_SEMESTER_START,
    };
};

export const getDefaultSemesterSuccess = (semester) => {
    return {
        type: actionTypes.GET_DEFAULT_SEMESTER_SUCCESS,
        semester,
    };
};

export const addItemToSchedule = (res) => {
    return {
        type: actionTypes.ADD_ITEM_TO_SCHEDULE,
        result: res,
    };
};

export const checkAvailabilityScheduleStart = (item) => {
    return {
        type: actionTypes.CHECK_AVAILABILITY_SCHEDULE_START,
        item,
    };
};

export const checkAvailabilityScheduleSuccess = (result) => {
    return {
        type: actionTypes.CHECK_AVAILABILITY_CHANGE_ROOM_SCHEDULE_SUCCESS,
        result,
    };
};

export const checkAvailabilityChangeRoomScheduleStart = (item) => {
    return {
        type: actionTypes.CHECK_AVAILABILITY_CHANGE_ROOM_SCHEDULE_START,
        item,
    };
};

export const getFullScheduleStart = (semesterId) => {
    return {
        type: actionTypes.GET_FULL_SCHEDULE_START,
        semesterId,
    };
};

export const getFullScheduleSuccess = (schedule) => {
    return {
        type: actionTypes.GET_FULL_SCHEDULE_SUCCESS,
        schedule,
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
export const getGroupScheduleStart = (groupId, semesterId) => {
    return {
        type: actionTypes.GET_GROUP_SCHEDULE_START,
        groupId,
        semesterId,
    };
};
export const getTeacherScheduleStart = (teacherId, semesterId) => {
    return {
        type: actionTypes.GET_TEACHER_SCHEDULE_START,
        teacherId,
        semesterId,
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
