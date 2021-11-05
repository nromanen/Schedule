import * as actionTypes from './actionsType';

export const getAllSemestersSuccess = (res) => {
    return {
        type: actionTypes.SHOW_ALL_SEMESTERS_SUCCESS,
        result: res,
    };
};
export const getAllSemestersStart = () => {
    return {
        type: actionTypes.GET_ALL_SEMESTERS_START,
    };
};

export const getDisabledSemestersSuccess = (res) => {
    return {
        type: actionTypes.SET_DISABLED_SEMESTERS_SUCCESS,
        result: res,
    };
};
export const getDisabledSemestersStart = () => {
    return {
        type: actionTypes.GET_DISABLED_SEMESTERS_START,
    };
};
export const getArchivedSemestersSuccess = (res) => {
    return {
        type: actionTypes.SET_ARCHIVED_SEMESTERS_SUCCESS,
        result: res,
    };
};
export const getArchivedSemesterByIdStart = (semesterId) => {
    return {
        type: actionTypes.GET_ARCHIVE_SEMESTER_BY_ID_START,
        semesterId,
    };
};

export const createArchivedSemesterStart = (semesterId) => {
    return {
        type: actionTypes.CREATE_ARCHIVE_SEMESTER_START,
        semesterId,
    };
};

export const getArchivedSemestersStart = () => {
    return {
        type: actionTypes.SET_ARCHIVED_SEMESTERS_START,
    };
};

export const addSemesterSuccess = (res) => {
    return {
        type: actionTypes.ADD_SEMESTER_SUCCESS,
        result: res,
    };
};
export const addSemesterStart = (item) => {
    return {
        type: actionTypes.ADD_SEMESTER_START,
        item,
    };
};
export const deleteSemesterSuccess = (res) => {
    return {
        type: actionTypes.DELETE_SEMESTER_SUCCESS,
        result: res,
    };
};
export const deleteSemesterStart = (semesterId) => {
    return {
        type: actionTypes.DELETE_SEMESTER_START,
        semesterId,
    };
};

export const selectSemesterSuccess = (res) => {
    return {
        type: actionTypes.SELECT_SEMESTER_SUCCESS,
        result: res,
    };
};

export const updateSemesterSuccess = (res) => {
    return {
        type: actionTypes.UPDATE_SEMESTER_SUCCESS,
        result: res,
    };
};

export const updateSemesterStart = (item) => {
    return {
        type: actionTypes.UPDATE_SEMESTER_START,
        item,
    };
};
export const updateSemesterByIdStartSuccess = (semesterId, isDisabled) => {
    return {
        type: actionTypes.UPDATE_SEMESTER_BY_ID_START_SUCCESS,
        semesterId,
        isDisabled,
    };
};
export const moveToArchivedSemesterSuccess = (res) => {
    return {
        type: actionTypes.MOVE_SEMESTER_TO_ARCHIVE_SUCCESS,
        result: res,
    };
};

export const clearSemesterSuccess = () => ({
    type: actionTypes.CLEAR_SEMESTER_SUCCESS,
});

export const handleSemesterFormSubmitStart = (values) => {
    return {
        type: actionTypes.HANDLE_SEMESTER_FORM_SUBMIT_START,
        values,
    };
};

export const setGroupsToSemesterStart = (semesterId, groups) => {
    return {
        type: actionTypes.SET_GROUPS_TO_SEMESTER_START,
        semesterId,
        groups,
    };
};

export const copyLessonsFromSemesterStart = (values) => {
    return {
        type: actionTypes.COPY_LESSONS_FROM_SEMESTER_START,
        values,
    };
};
export const setSemesterCopyStart = (values) => {
    return {
        type: actionTypes.SET_SEMESTER_COPY_START,
        values,
    };
};
export const toggleSemesterVisibilityStart = (semester) => {
    return {
        type: actionTypes.TOGGLE_SEMESTER_VISIBILITY_START,
        semester,
    };
};
