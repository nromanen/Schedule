import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    lessons: [],
    lessonTypes: [],
    lesson: {},
    groupId: null,
    uniqueError: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_LESSON_CARD:
            return updateObject(state, {
                lessons: state.lessons.concat(action.result)
            });
        case actionTypes.SET_LESSONS_CARDS:
            return updateObject(state, {
                lessons: action.result
            });
        case actionTypes.SET_LESSON_TYPES:
            return updateObject(state, {
                lessonTypes: action.result
            });
        case actionTypes.DELETE_LESSON_CARD:
            state.lessons = state.lessons.filter(
                lesson => lesson.id !== action.result
            );
            return updateObject(state, {
                lessons: state.lessons
            });
        case actionTypes.SELECT_LESSON_CARD:
            let lesson = state.lessons.filter(
                lesson => lesson.id === action.result
            )[0];
            if (!lesson) {
                lesson = { id: null };
            }
            return updateObject(state, {
                lesson: lesson
            });
        case actionTypes.UPDATE_LESSON_CARD:
            const updatedLessons = [];
            state.lessons.forEach(lesson => {
                if (lesson.id === action.result.id) {
                    lesson = { ...lesson, ...action.result };
                }
                updatedLessons.push(lesson);
            });
            return updateObject(state, {
                lessons: updatedLessons,
                lesson: {}
            });
        case actionTypes.SELECT_GROUP_ID:
            return updateObject(state, {
                lesson: {},
                groupId: action.result
            });
        case actionTypes.SET_UNIQUE_ERROR:
            return updateObject(state, {
                uniqueError: action.result
            });
        default:
            return state;
    }
};

export default reducer;
