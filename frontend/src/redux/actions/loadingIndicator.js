import * as actionTypes from './actionsType';

export const setLoading = res => {
    return {
        type: actionTypes.SET_LOADING_INDICATOR,
        result: res
    };
};

export const setScheduleLoading = res => {
    return {
        type: actionTypes.SET_SCHEDULE_LOADING_INDICATOR,
        result: res
    };
};



