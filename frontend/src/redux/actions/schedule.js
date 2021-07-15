import * as actionTypes from './actionsType';

export const setScheduleItems = res => {
    return {
        type: actionTypes.SET_SCHEDULE_ITEMS,
        result: res
    };
};

export const setCurrentSemester = res => {
    return {
        type: actionTypes.SET_CURRENT_SEMESTER,
        result: res
    };
};

export const addItemToSchedule = res => {
    return {
        type: actionTypes.ADD_ITEM_TO_SCHEDULE,
        result: res
    };
};

export const checkAvailabilitySchedule = res => {
    return {
        type: actionTypes.CHECK_AVAILABILITY_SCHEDULE,
        result: res
    };
};

export const setFullSchedule = result => {
    return {
        type: actionTypes.SET_FULL_SCHEDULE,
        result: result
    };
};
export const setItemGroupId = res => {
    return {
        type: actionTypes.SET_ITEM_GROUP_ID,
        result: res
    };
};

export const setGroupSchedule = result => {
    return {
        type: actionTypes.SET_GROUP_SCHEDULE,
        result: result
    };
};
export const deleteItemFromSchedule = res => {
    return {
        type: actionTypes.DELETE_ITEM_FROM_SCHEDULE,
        result: res
    };
};

export const setScheduleType = result => {
    return {
        type: actionTypes.SET_SCHEDULE_TYPE,
        newType: result
    };
};

export const setScheduleGroupId = groupId => {
    return {
        type: actionTypes.SET_SCHEDULE_GROUP_ID,
        groupId: groupId
    };
};

export const setScheduleTeacherId = teacherId => {
    return {
        type: actionTypes.SET_SCHEDULE_TEACHER_ID,
        teacherId: teacherId
    };
};
export const setTeacherSchedule = result => {
    return {
        type: actionTypes.SET_TEACHER_SCHEDULE,
        result: result
    };
};

export const setSemesterList = result => {
    return {
        type: actionTypes.SET_SEMESTER_LIST,
        result: result
    };
};
export const setScheduleSemesterId = semesterId => {
    console.log("setScheduleSemesterId",semesterId)
    return {
        type: actionTypes.SET_SCHEDULE_SEMESTER_ID,
        semesterId: semesterId
    };
};

export const setTeacherRangeSchedule = result => {
    return {
        type: actionTypes.SET_TEACHER_RANGE_SCHEDULE,
        result: result
    };
};

export const setTeacherViewType = type => {
    return {
        type: actionTypes.SET_TEACHER_VIEW_TYPE,
        result: type
    };
};
