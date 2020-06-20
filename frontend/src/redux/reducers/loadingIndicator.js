import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    loading: false,
    scheduleLoading: false,
    semesterLoading: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_LOADING_INDICATOR:
            return updateObject(state, {
                loading: action.result
            });
        case actionTypes.SET_SCHEDULE_LOADING_INDICATOR:
            return updateObject(state, {
                scheduleLoading: action.result
            });
        case actionTypes.SET_SEMESTER_LOADING_INDICATOR:
            return updateObject(state, {
                semesterLoading: action.result
            });
        default:
            return state;
    }
};

export default reducer;
