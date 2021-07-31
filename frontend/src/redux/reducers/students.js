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
        default:
            return state;
    }
};

export default students;