import * as actionTypes from './actionsType';

export const getAllDepartments = (res) => ({
    type: actionTypes.GET_ALL_DEPARTMENTS,
    result: res,
});

export const clearDepartmentForm = () => ({
    type: actionTypes.CLEAR_DEPARTMENT_FORM,
});

export const getDepartItemById = (res) => ({
    type: actionTypes.GET_DEPARTMENT_BY_ID,
    result: res,
});
