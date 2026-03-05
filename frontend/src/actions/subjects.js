import * as actionTypes from './actionsType';

export const showAllSubjects = (res) => {
    return {
        type: actionTypes.SHOW_ALL_SUBJECTS,
        result: res,
    };
};

export const selectSubject = (res) => {
    return {
        type: actionTypes.SELECT_SUBJECT,
        result: res,
    };
};

