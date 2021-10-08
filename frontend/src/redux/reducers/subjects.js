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
            let subject = state.subjects.filter((subj) => subj.id === action.result)[0];
            if (!subject) {
                subject = { id: null };
            }
            return updateObject(state, {
                subject,
            });
        }
        case actionTypes.UPDATE_SUBJECT: {
            const updatedSubjects = state.subjects.map((subject) => {
                if (subject.id === action.result.id) {
                    return { ...subject, ...action.result };
                }
                return subject;
            });
            return updateObject(state, {
                subjects: updatedSubjects,
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
