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

export const fetchAllStudentsStart = (id) => {
    return {
        type: actionTypes.FETCH_ALL_STUDENTS,
        id,
    };
};

export const createStudentStart = (data) => {
    return {
        type: actionTypes.START_CREATE_STUDENTS,
        data,
    };
};

export const updateStudentStart = (data) => {
    return {
        type: actionTypes.START_UPDATE_STUDENTS,
        data,
    };
};

export const deleteStudentStart = (id) => {
    return {
        type: actionTypes.START_DELETE_STUDENTS,
        id,
    };
};
