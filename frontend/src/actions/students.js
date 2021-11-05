import * as actionTypes from './actionsType';

export const createStudentSuccess = (res) => {
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

export const deleteStudentSuccess = (res) => {
    return {
        type: actionTypes.DELETE_STUDENT,
        result: res,
    };
};
export const selectStudentSuccess = (res) => {
    return {
        type: actionTypes.SET_STUDENT,
        result: res,
    };
};

export const updateStudentSuccess = (res) => {
    return {
        type: actionTypes.UPDATE_STUDENT,
        result: res,
    };
};

export const checkAllStudentsSuccess = (checkedStudents, checkedAll) => {
    return {
        type: actionTypes.CHECK_ALL_STUDENTS,
        checkedStudents,
        checkedAll,
    };
};

export const fetchAllStudentsStart = (id) => {
    return {
        type: actionTypes.FETCH_ALL_STUDENTS,
        id,
    };
};

export const submitStudentStart = (data, groupId) => {
    return {
        type: actionTypes.SUBMIT_STUDENT_FORM,
        data,
        groupId,
    };
};

export const deleteStudentStart = (id) => {
    return {
        type: actionTypes.DELETE_STUDENT_START,
        id,
    };
};

export const moveStudentsToGroupStart = (group, newGroup) => {
    return {
        type: actionTypes.MOVE_STUDENTS_TO_GROUP_START,
        group,
        newGroup,
    };
};
