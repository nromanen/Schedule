import * as actionTypes from '../actions/actionsType';

const initialState = {
    lessons: [],
    selectedTeacher: null,
    loading: false,
};

const teacherLessonsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_LESSONS_BY_TEACHER_START:
            return {
                ...state,
                loading: true,
            };

        case actionTypes.GET_LESSONS_BY_TEACHER_SUCCESS:
            return {
                ...state,
                lessons: action.lessons,
                selectedTeacher: action.teacher,
                loading: false,
            };

        case actionTypes.UPDATE_LESSONS_LINK_SUCCESS:
            return {
                ...state,
                lessons: action.lessons,
            };

        case actionTypes.CLEAR_TEACHER_LESSONS:
            return {
                ...state,
                lessons: [],
                selectedTeacher: null,
            };

        case actionTypes.SET_TEACHER_LESSONS_LOADING:
            return {
                ...state,
                loading: action.loading,
            };

        default:
            return state;
    }
};

export default teacherLessonsReducer;