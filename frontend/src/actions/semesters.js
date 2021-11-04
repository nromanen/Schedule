import * as actionTypes from './actionsType';

export const showAllSemesters = (res) => {
    return {
        type: actionTypes.SHOW_ALL_SEMESTERS,
        result: res,
    };
};
export const getAllSemestersStart = () => {
    return {
        type: actionTypes.GET_ALL_SEMESTERS_START,
    };
};

export const setDisabledSemesters = (res) => {
    return {
        type: actionTypes.SET_DISABLED_SEMESTERS,
        result: res,
    };
};
export const getDisabledSemestersStart = () => {
    return {
        type: actionTypes.GET_DISABLED_SEMESTERS_START,
    };
};
export const setArchivedSemesters = (res) => {
    return {
        type: actionTypes.SET_ARCHIVED_SEMESTERS,
        result: res,
    };
};
export const getArchivedSemesterStart = (semesterId) => {
    return {
        type: actionTypes.GET_ARCHIVE_SEMESTER_START,
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

export const addSemester = (res) => {
    return {
        type: actionTypes.ADD_SEMESTER,
        result: res,
    };
};
export const addSemesterStart = (item) => {
    return {
        type: actionTypes.ADD_SEMESTER_START,
        item,
    };
};
export const deleteSemester = (res) => {
    return {
        type: actionTypes.DELETE_SEMESTER,
        result: res,
    };
};
export const deleteSemesterStart = (semesterId) => {
    return {
        type: actionTypes.DELETE_SEMESTER_START,
        semesterId,
    };
};

export const selectSemester = (res) => {
    return {
        type: actionTypes.SELECT_SEMESTER,
        result: res,
    };
};

export const updateSemester = (res) => {
    return {
        type: actionTypes.UPDATE_SEMESTER,
        result: res,
    };
};

export const updateSemesterStart = (item) => {
    return {
        type: actionTypes.UPDATE_SEMESTER_START,
        item,
    };
};
export const updateSemesterByIdStart = (semesterId, isDisabled) => {
    return {
        type: actionTypes.UPDATE_SEMESTER_BY_ID_START,
        semesterId,
        isDisabled,
    };
};
export const moveToArchivedSemester = (res) => {
    return {
        type: actionTypes.MOVE_SEMESTER_TO_ARCHIVE,
        result: res,
    };
};

export const clearSemester = () => ({
    type: actionTypes.CLEAR_SEMESTER,
});

export const setError = (res) => {
    return {
        type: actionTypes.SET_ERROR,
        result: res,
    };
};

export const handleSemesterStart = (values) => {
    return {
        type: actionTypes.HANDLE_SEMESTER_START,
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
