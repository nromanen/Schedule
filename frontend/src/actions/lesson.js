import * as actionTypes from './actionsType';

export const createLesson = (result) => {
    return {
        type: actionTypes.CREATE_LESSON_CARD_SUCCESS,
        result,
    };
};

export const createLessonStart = (payload) => {
    return {
        type: actionTypes.CREATE_LESSON_CARD_START,
        payload,
    };
};

export const getLessonsByGroup = (id) => {
    return {
        type: actionTypes.GET_LESSONS_CARDS_START,
        id,
    };
};

export const setLessonsCards = (result) => {
    return {
        type: actionTypes.SET_LESSONS_CARDS,
        result,
    };
};

export const getLessonTypes = () => ({
    type: actionTypes.GET_LESSON_TYPES_START,
});

export const setLessonTypes = (result) => ({
    type: actionTypes.SET_LESSON_TYPES,
    result,
});

export const deleteLessonCard = (id) => {
    return {
        type: actionTypes.DELETE_LESSON_CARD_SUCCESS,
        id,
    };
};

export const deleteLessonCardStart = (id) => {
    return {
        type: actionTypes.DELETE_LESSON_CARD_START,
        id,
    };
};

export const copyLessonCard = (group, lesson) => {
    return {
        type: actionTypes.COPY_LESSON_START,
        group,
        lesson,
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
        type: actionTypes.UPDATE_LESSON_CARD_SUCCESS,
        result: res,
    };
};

export const updateLessonCardStart = (payload) => {
    return {
        type: actionTypes.UPDATE_LESSON_CARD_START,
        payload,
    };
};

export const handleLessonStart = (values) => {
    return {
        type: actionTypes.HANDLE_LESSON_CARD_START,
        values,
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
