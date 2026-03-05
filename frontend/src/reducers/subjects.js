import * as actionTypes from '../actions/actionsType';

const initialState = {
    subjects: [],
    subject: {},
    disabledSubjects: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_ALL_SUBJECTS:
            return { ...state, subjects: action.result };

        case actionTypes.SELECT_SUBJECT: {
            let subject = state.subjects.find((subj) => subj.id === action.result);
            if (!subject) {
                subject = { id: null };
            }
            return { ...state, subject };
        }

        default:
            return state;
    }
};

export default reducer;
