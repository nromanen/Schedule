import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    temporarySchedules: [],
    temporarySchedule: {},
    schedulesAndTemporarySchedules: [],
    teacherId: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_TEMPORARY_SCHEDULES:
            return updateObject(state, {
                temporarySchedules: action.result
            });
        case actionTypes.SET_SCHEDULES_AND_TEMPORARY_SCHEDULES:
            return updateObject(state, {
                schedulesAndTemporarySchedules: action.result
            });
        case actionTypes.SELECT_TEMPORARY_SCHEDULE:
            return updateObject(state, {
                temporarySchedule: action.result
            });
        case actionTypes.SELECT_TEACHER_ID:
            return updateObject(state, {
                teacherId: action.result
            });
        default:
            return state;
    }
};

export default reducer;
