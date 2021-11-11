import * as actionsType from './actionsType';

export const handleTeacherStart = (values) => {
    return {
        type: actionsType.HANDLE_TEACHER_START,
        values,
    };
};

export const addTeacher = (teacher) => {
    return {
        type: actionsType.ADD_TEACHER,
        teacher,
    };
};

export const addTeacherStart = (teacher) => {
    return {
        type: actionsType.ADD_TEACHER_START,
        teacher,
    };
};

export const setTeacher = (teacher) => {
    return {
        type: actionsType.SET_TEACHER,
        result: teacher,
    };
};

export const toggleTeacherStart = (teacherId, disableStatus) => {
    return {
        type: actionsType.TOOGLE_TEACHER_START,
        teacherId,
        disableStatus,
    };
};

export const deleteTeacher = (id, disableStatus) => {
    return {
        type: actionsType.DELETE_TEACHER,
        id,
        disableStatus,
    };
};

export const deleteTeacherStart = (id) => {
    return {
        type: actionsType.DELETE_TEACHER_START,
        id,
    };
};

export const selectTeacherCard = (res) => {
    return {
        type: actionsType.SELECT_TEACHER,
        result: res,
    };
};

export const updateTeacherCard = (teacher) => {
    return {
        type: actionsType.UPDATE_TEACHER,
        teacher,
    };
};

export const updateTeacherCardStart = (teacher) => {
    return {
        type: actionsType.UPDATE_TEACHER_START,
        teacher,
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
