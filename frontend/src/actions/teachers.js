import * as actionsType from './actionsType';

export const handleTeacherStart = (values) => ({
    type: actionsType.HANDLE_TEACHER_START,
    values,
});

export const addTeacherSuccess = (teacher) => ({
    type: actionsType.ADD_TEACHER_SUCCESS,
    teacher,
});

export const addTeacherStart = (teacher) => ({
    type: actionsType.ADD_TEACHER_START,
    teacher,
});

export const setTeacher = (teacher) => ({
    type: actionsType.SET_TEACHER,
    result: teacher,
});

export const toggleTeacherStart = (teacherId, disableStatus) => ({
    type: actionsType.TOOGLE_TEACHER_START,
    teacherId,
    disableStatus,
});

export const deleteTeacherSuccess = (id, disableStatus) => ({
    type: actionsType.DELETE_TEACHER_SUCCESS,
    id,
    disableStatus,
});

export const deleteTeacherStart = (id) => ({
    type: actionsType.DELETE_TEACHER_START,
    id,
});

export const selectTeacherCard = (res) => ({
    type: actionsType.SELECT_TEACHER,
    result: res,
});

export const updateTeacherCardSuccess = (teacher) => ({
    type: actionsType.UPDATE_TEACHER_SUCCESS,
    teacher,
});

export const updateTeacherCardStart = (teacher) => ({
    type: actionsType.UPDATE_TEACHER_START,
    teacher,
});

export const showAllTeachersSuccess = (teachers) => ({
    type: actionsType.SHOW_ALL_TEACHERS_SUCCESS,
    result: teachers,
});

export const showAllTeachersStart = (teachers) => ({
    type: actionsType.SHOW_ALL_TEACHERS_START,
    result: teachers,
});

export const getTeacherWithoutAccountStart = (teachers) => ({
    type: actionsType.GET_TEACHERS_WITHOUT_ACCOUNT_START,
    result: teachers,
});

export const getTeacherWithoutAccountSuccess = (teachers) => ({
    type: actionsType.GET_TEACHERS_WITHOUT_ACCOUNT_SUCCESS,
    result: teachers,
});

export const getAllPublicTeachersByDepartmentStart = (departmentId) => ({
    type: actionsType.GET_ALL_PUBLIC_TEACHERS_BY_DEPARTMENT_START,
    departmentId,
});

export const getAllTeachersByDepartmentId = (teachers) => ({
    type: actionsType.GET_TEACHERS_BY_DEPARTMENT,
    result: teachers,
});

export const setDisabledTeachersSuccess = (teachers) => ({
    type: actionsType.SET_DISABLED_TEACHERS_SUCCESS,
    result: teachers,
});

export const setDisabledTeachersStart = (teachers) => ({
    type: actionsType.SET_DISABLED_TEACHERS_START,
    result: teachers,
});
