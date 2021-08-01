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
        case actionTypes.SET_STUDENT:
            let student = state.students.filter(
                student => student.id === action.result
            )[0];

            if (!student) {
                student = { id: null };
            }
            return updateObject(state, {
                students: state.students,
                student: student
            });
        case actionTypes.UPDATE_STUDENT:
            const updatedStudents = [];
            state.students.forEach(student => {
                if (student.id === action.result.id) {
                    student = { ...student, ...action.result };
                }
                updatedStudents.push(student);
            });
            return updateObject(state, {
                students: updatedStudents,
                student: {}
            });
        default:
            return state;
    }
};

export default students;