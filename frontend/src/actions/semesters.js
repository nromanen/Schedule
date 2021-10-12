import * as actionTypes from './actionsType';

export const showAllSemesters = (res) => {
    return {
        type: actionTypes.SHOW_ALL_SEMESTERS,
        result: res,
    };
};

export const setDisabledSemesters = (res) => {
    return {
        type: actionTypes.SET_DISABLED_SEMESTERS,
        result: res,
    };
};
export const setArchivedSemesters = (res) => {
    return {
        type: actionTypes.SET_ARCHIVED_SEMESTERS,
        result: res,
    };
};

export const addSemester = (res) => {
    return {
        type: actionTypes.ADD_SEMESTER,
        result: res,
    };
};

export const deleteSemester = (res) => {
    return {
        type: actionTypes.DELETE_SEMESTER,
        result: res,
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
