import * as actionTypes from './actionsType';

export const addTemporarySchedule = res => {
    return {
        type: actionTypes.ADD_TEMPORARY_SCHEDULE,
        result: res
    };
};

export const setTemporarySchedules = res => {
    return {
        type: actionTypes.SET_TEMPORARY_SCHEDULES,
        result: res
    };
};

export const setSchedulesAndTemporarySchedules = res => {
    return {
        type: actionTypes.SET_SCHEDULES_AND_TEMPORARY_SCHEDULES,
        result: res
    };
};

export const deleteTemporarySchedule = res => {
    return {
        type: actionTypes.DELETE_TEMPORARY_SCHEDULE,
        result: res
    };
};

export const selectTemporarySchedule = res => {
    return {
        type: actionTypes.SELECT_TEMPORARY_SCHEDULE,
        result: res
    };
};

export const updateTemporarySchedule = res => {
    return {
        type: actionTypes.UPDATE_TEMPORARY_SCHEDULE,
        result: res
    };
};

export const selectTeacherId = res => {
    return {
        type: actionTypes.SELECT_TEACHER_ID,
        result: res
    };
};
