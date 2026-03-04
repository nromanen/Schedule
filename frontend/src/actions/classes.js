import * as actionTypes from './actionsType';


export const getClassScheduleListStart = () => ({
    type: actionTypes.GET_CLASS_SCHEDULE_LIST_START,
});

export const getClassScheduleListSuccess = (classScheduler) => ({
    type: actionTypes.GET_CLASS_SCHEDULE_LIST_SUCCESS,
    classScheduler,
});

export const getPublicClassScheduleStart = () => ({
    type: actionTypes.GET_PUBLIC_CLASS_SCHEDULE_LIST_START,
});

export const getPublicClassScheduleSuccess = (classScheduler) => ({
    type: actionTypes.GET_PUBLIC_CLASS_SCHEDULE_LIST_SUCCESS,
    classScheduler,
});
