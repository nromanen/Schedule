import * as actionTypes from "./actionsType";

export const setClassScheduleList = classScheduler => ({
  type: actionTypes.SET_CLASS_SCHEDULE_LIST,
  classScheduler
});

export const addClassScheduleOne = classSchedulOne => ({
  type: actionTypes.ADD_CLASS_SCHEDULE_ONE,
  classSchedulOne
});

export const getClassScheduleList = () => ({
  type: actionTypes.GET_CLASS_SCHEDULE_LIST
});

export const getClassScheduleOne = classSchedulOne => ({
  type: actionTypes.GET_CLASS_SCHEDULE_ONE,
  classSchedulOne
});

export const deleteClassScheduleOne = classSchedulOne => ({
  type: actionTypes.DELETE_CLASS_SCHEDULE_ONE,
  classSchedulOne
});

export const updateClassScheduleOne = classSchedulOne => ({
  type: actionTypes.UPDATE_CLASS_SCHEDULE_ONE,
  classSchedulOne
});

export const clearClassScheduleOne = () => ({
  type: actionTypes.CLEAR_CLASS_SCHEDULE_ONE
});
