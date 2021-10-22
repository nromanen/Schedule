import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    subjects: [],
    subject: {},
    disabledSubjects: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_SUBJECT:
            return updateObject(state, {
                subjects: state.subjects.concat(action.result),
            });

        case actionTypes.DELETE_SUBJECT: {
            const subjects = state.subjects.filter((subject) => subject.id !== action.result);
            return updateObject(state, {
                subjects,
            });
        }
        case actionTypes.SHOW_ALL_SUBJECTS:
            return updateObject(state, {
                subjects: action.result,
            });

        case actionTypes.SET_DISABLED_SUBJECTS:
            return updateObject(state, {
                disabledSubjects: action.result,
            });

        case actionTypes.SELECT_SUBJECT: {
            let subject = state.subjects.find((subj) => subj.id === action.result);
            if (!subject) {
                subject = { id: null };
            }
            return updateObject(state, {
                subject,
            });
        }
        case actionTypes.UPDATE_SUBJECT: {
            const subjectIndex = state.subjects.findIndex(({ id }) => id === action.result.id);
            const subjects = [...state.subjects];
            subjects[subjectIndex] = {
                ...subjects[subjectIndex],
                ...action.result,
            };
            return updateObject(state, {
                subjects,
                subject: {},
            });
        }
        case actionTypes.CLEAR_SUBJECT:
            return updateObject(state, {
                subject: {},
            });

        default:
            return state;
    }
};

export default reducer;
