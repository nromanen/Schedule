import * as actionTypes from './actionsType';

export const createStudent = (res) => {
    return {
        type: actionTypes.CREATE_STUDENT,
        result: res,
    };
};
export const showAllStudents = (res) => {
    return {
        type: actionTypes.SHOW_ALL_STUDENTS,
        res,
    };
};
export const showAllStudentsByGroupId = (groupId) => {
    return {
        type: actionTypes.SHOW_ALL_STUDENTS_BY_GROUP_ID,
        groupId,
    };
};
export const deleteStudent = (res) => {
    return {
        type: actionTypes.DELETE_STUDENT,
        result: res,
    };
};
export const setStudent = (res) => {
    return {
        type: actionTypes.SET_STUDENT,
        result: res,
    };
};
export const updateStudent = (res) => {
    return {
        type: actionTypes.UPDATE_STUDENT,
        result: res,
    };
};
// new
export const fetchAllStudents = () => {
    return {
        type: actionTypes.FETCH_ALL_STUDENTS,
    };
};

export const startCreateStudent = (data) => {
    return {
        type: actionTypes.START_CREATE_STUDENTS,
        data,
    };
};

export const startUpdateStudent = (data) => {
    return {
        type: actionTypes.START_UPDATE_STUDENTS,
        data,
    };
};
