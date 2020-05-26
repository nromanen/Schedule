import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    semesters: [],
    semester: {},
    disabledSemesters: []
};

const semesters = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_SEMESTER:
            return updateObject(state, {
                semesters: state.semesters.concat(action.result),
                semester: state.semester
            });

        case actionTypes.DELETE_SEMESTER:
            state.semesters = state.semesters.filter(
                semester => semester.id !== action.result
            );
            return updateObject(state, {
                semesters: state.semesters,
                semester: state.semester
            });

        case actionTypes.SHOW_ALL_SEMESTERS:
            return updateObject(state, {
                semesters: action.result,
                semester: state.semester
            });
        case actionTypes.SET_DISABLED_SEMESTERS:
            return updateObject(state, {
                disabledSemesters: action.result
            });

        case actionTypes.SELECT_SEMESTER:
            let semester = state.semesters.filter(
                semester => semester.id === action.result
            )[0];
            if (!semester) {
                semester = { id: null };
            }
            return updateObject(state, {
                semesters: state.semesters,
                semester: semester
            });

        case actionTypes.UPDATE_SEMESTER:
            const updatedSemesters = [];
            state.semesters.forEach(semester => {
                if (semester.id === action.result.id) {
                    semester = { ...semester, ...action.result };
                }
                updatedSemesters.push(semester);
            });
            return updateObject(state, {
                semesters: updatedSemesters,
                semester: {}
            });

        case actionTypes.CLEAR_SEMESTER:
            return {
                ...state,
                semester: {}
            };
        case actionTypes.SET_ERROR:
            return updateObject(state, {
                uniqueError: action.result
            });

        default:
            return state;
    }
};

export default semesters;
