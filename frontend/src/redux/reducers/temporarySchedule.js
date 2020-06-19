import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    temporarySchedules: [],
    temporarySchedule: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_TEMPORARY_SCHEDULE:
            return updateObject(state, {
                changes: state.temporarySchedules.concat(action.result)
            });
        case actionTypes.GET_TEMPORARY_SCHEDULES:
            return updateObject(state, {
                changes: action.result
            });
        case actionTypes.DELETE_TEMPORARY_SCHEDULE:
            state.temporarySchedules = state.temporarySchedules.filter(
                change => change.id !== action.result
            );
            return updateObject(state, {
                changes: state.temporarySchedules
            });
        case actionTypes.SELECT_TEMPORARY_SCHEDULE:
            let change = state.temporarySchedules.filter(
                change => change.id === action.result
            )[0];
            if (!change) {
                change = { id: null };
            }
            return updateObject(state, {
                change: change
            });
        case actionTypes.UPDATE_TEMPORARY_SCHEDULE:
            const updatedLessonChanges = [];
            state.temporarySchedules.forEach(change => {
                if (change.id === action.result.id) {
                    change = { ...change, ...action.result };
                }
                updatedLessonChanges.push(change);
            });
            return updateObject(state, {
                changes: updatedLessonChanges,
                change: {}
            });
        default:
            return state;
    }
};

export default reducer;
