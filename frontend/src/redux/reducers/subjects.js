import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    subjects: [],
    subject: {},
    disabledSubjects: [],
};

const subjects = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_SUBJECT:
            return updateObject(state, {
                subjects: state.subjects.concat(action.result),
                subject: state.subject,
            });

        case actionTypes.DELETE_SUBJECT:
            state.subjects = state.subjects.filter((subject) => subject.id !== action.result);
            return updateObject(state, {
                subjects: state.subjects,
                subject: state.subject,
            });

        case actionTypes.SHOW_ALL_SUBJECTS:
            return updateObject(state, {
                subjects: action.result,
                subject: state.subject,
            });

        case actionTypes.SET_DISABLED_SUBJECTS:
            return updateObject(state, {
                disabledSubjects: action.result,
            });

        case actionTypes.SELECT_SUBJECT:
            let subject = state.subjects.filter((subject) => subject.id === action.result)[0];
            if (!subject) {
                subject = { id: null };
            }
            return updateObject(state, {
                subjects: state.subjects,
                subject,
            });

        case actionTypes.UPDATE_SUBJECT:
            const updatedSubjects = [];
            state.subjects.forEach((subject) => {
                if (subject.id === action.result.id) {
                    subject = { ...subject, ...action.result };
                }
                updatedSubjects.push(subject);
            });
            return updateObject(state, {
                subjects: updatedSubjects,
                subject: {},
            });

        case actionTypes.CLEAR_SUBJECT:
            return {
                ...state,
                subject: {},
            };

        default:
            return state;
    }
};

export default subjects;
