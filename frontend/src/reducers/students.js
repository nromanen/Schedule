import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    studentsByGroup: [],
    students: [],
    student: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_STUDENT:
            return updateObject(state, {
                students: state.students.concat(action.res),
            });
        case actionTypes.SHOW_ALL_STUDENTS:
            return updateObject(state, {
                students: action.res,
            });
        case actionTypes.DELETE_STUDENT: {
            const students = state.students.filter((student) => student.id !== action.result);
            return updateObject(state, {
                students,
            });
        }
        case actionTypes.SET_STUDENT: {
            let student = state.students.find((stud) => stud.id === Number(action.result));

            if (!student) {
                student = { id: null };
            }
            return updateObject(state, {
                student,
            });
        }
        case actionTypes.UPDATE_STUDENT: {
            const studentIndex = state.students.findIndex(({ id }) => id === action.result.id);
            const students = [...state.students];
            students[studentIndex] = {
                ...students[studentIndex],
                ...action.result,
            };
            return updateObject(state, {
                students,
                student: {},
            });
        }
        default:
            return state;
    }
};

export default reducer;
