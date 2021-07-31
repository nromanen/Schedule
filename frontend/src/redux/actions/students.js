import * as actionTypes from './actionsType';

export const addStudent = res => {
    return {
        type: actionTypes.ADD_STUDENT,
        result: res
    };
};