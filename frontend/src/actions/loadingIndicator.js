import * as actionTypes from './actionsType';

export const setLoading = (res) => {
    return {
        type: actionTypes.SET_LOADING_INDICATOR,
        result: res,
    };
};

export const setScheduleLoading = (res) => {
    return {
        type: actionTypes.SET_SCHEDULE_LOADING_INDICATOR,
        result: res,
    };
};
export const setMainScheduleLoading = (res) => {
    return {
        type: actionTypes.SET_MAIN_SCHEDULE_LOADING_INDICATOR,
        result: res,
    };
};

export const setSemesterLoading = (res) => {
    return {
        type: actionTypes.SET_SEMESTER_LOADING_INDICATOR,
        result: res,
    };
};

export const setRoomsLoading = (res) => {
    return {
        type: actionTypes.SET_ROOMS_LOADING_INDICATOR,
        result: res,
    };
};
