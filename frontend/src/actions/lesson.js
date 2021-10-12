import * as actionTypes from './actionsType';

export const storeLessonCard = (res) => {
    return {
        type: actionTypes.ADD_LESSON_CARD,
        result: res,
    };
};

export const setLessonsCards = (res) => {
    return {
        type: actionTypes.SET_LESSONS_CARDS,
        result: res,
    };
};

export const setLessonTypes = (res) => {
    return {
        type: actionTypes.SET_LESSON_TYPES,
        result: res,
    };
};

export const deleteLessonCard = (res) => {
    return {
        type: actionTypes.DELETE_LESSON_CARD,
        result: res,
    };
};

export const selectLessonCard = (res) => {
    return {
        type: actionTypes.SELECT_LESSON_CARD,
        result: res,
    };
};

export const updateLessonCard = (res) => {
    return {
        type: actionTypes.UPDATE_LESSON_CARD,
        result: res,
    };
};

export const selectGroupId = (res) => {
    return {
        type: actionTypes.SELECT_GROUP_ID,
        result: res,
    };
};

export const setUniqueError = (res) => {
    return {
        type: actionTypes.SET_UNIQUE_ERROR,
        result: res,
    };
};
