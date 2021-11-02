import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    lessons: [],
    lessonTypes: [],
    lesson: {},
    groupId: null,
    uniqueError: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_LESSON_CARD_SUCCESS:
            return updateObject(state, {
                lessons: state.lessons.concat(action.result),
            });
        case actionTypes.SET_LESSONS_CARDS:
            return updateObject(state, {
                lessons: action.result,
            });
        case actionTypes.SET_LESSON_TYPES:
            return updateObject(state, {
                lessonTypes: action.result,
            });
        case actionTypes.DELETE_LESSON_CARD: {
            const lessons = state.lessons.filter((lesson) => lesson.id !== action.id);
            return updateObject(state, {
                lessons,
            });
        }
        case actionTypes.SELECT_LESSON_CARD: {
            let lesson = state.lessons.find((less) => less.id === action.result);
            if (!lesson) {
                lesson = { id: null };
            }
            return updateObject(state, {
                lesson,
            });
        }
        case actionTypes.UPDATE_LESSON_CARD: {
            const lessonIndex = state.lessons.findIndex(({ id }) => id === action.result.id);
            const lessons = [...state.lessons];

            lessons[lessonIndex] = {
                ...lessons[lessonIndex],
                ...action.result,
            };
            return updateObject(state, {
                lessons,
                lesson: {},
            });
        }
        case actionTypes.SELECT_GROUP_ID:
            return updateObject(state, {
                lesson: {},
                groupId: action.result,
            });
        case actionTypes.SET_UNIQUE_ERROR:
            return updateObject(state, {
                uniqueError: action.result,
            });
        default:
            return state;
    }
};

export default reducer;
