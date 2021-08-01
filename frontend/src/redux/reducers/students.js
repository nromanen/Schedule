import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    students: [],
    student: {}
};

const students = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_STUDENT:
            return updateObject(state, {
                students: state.students.concat(action.result),
                student: state.student
            });
        case actionTypes.SHOW_ALL_STUDENTS_BY_GROUP_ID:
            return updateObject(state, {
                ...state,
                students: action.result
            });
        case actionTypes.DELETE_STUDENT:
            state.students = state.students.filter(
                student => student.id !== action.result
            );
            return updateObject(state, {
                students: state.students,
                student: state.student
            });
        default:
            return state;
    }
};

export default students;