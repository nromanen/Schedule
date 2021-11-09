import * as actionsType from './actionsType';

export const addTeacher = (teacher) => {
    return {
        type: actionsType.ADD_TEACHER,
        result: teacher,
    };
};

export const setTeacher = (teacher) => {
    return {
        type: actionsType.SET_TEACHER,
        result: teacher,
    };
};

export const deleteTeacher = (id) => {
    return {
        type: actionsType.DELETE_TEACHER,
        result: id,
    };
};

export const deleteTeacherStart = (id) => {
    return {
        type: actionsType.DELETE_TEACHER_START,
        result: id,
    };
};

export const selectTeacherCard = (res) => {
    return {
        type: actionsType.SELECT_TEACHER,
        result: res,
    };
};

export const updateTeacherCard = (res) => {
    return {
        type: actionsType.UPDATE_TEACHER,
        result: res,
    };
};

export const showAllTeachers = (teachers) => {
    return {
        type: actionsType.SHOW_ALL_TEACHERS,
        result: teachers,
    };
};

export const showAllTeachersStart = (teachers) => {
    return {
        type: actionsType.SHOW_ALL_TEACHERS_START,
        result: teachers,
    };
};

export const getTeacherWithoutAccountStart = (teachers) => {
    return {
        type: actionsType.GET_TEACHERS_WITHOUT_ACCOUNT_START,
        result: teachers,
    };
};

export const getTeacherWithoutAccountSuccess = (teachers) => {
    return {
        type: actionsType.GET_TEACHERS_WITHOUT_ACCOUNT_SUCCESS,
        result: teachers,
    };
};
export const getAllTeachersByDepartmentId = (teachers) => {
    return {
        type: actionsType.GET_TEACHERS_BY_DEPARTMENT,
        result: teachers,
    };
};

export const setDisabledTeachers = (teachers) => {
    return {
        type: actionsType.SET_DISABLED_TEACHERS,
        result: teachers,
    };
};

export const setDisabledTeachersStart = (teachers) => {
    return {
        type: actionsType.SET_DISABLED_TEACHERS_START,
        result: teachers,
    };
};
