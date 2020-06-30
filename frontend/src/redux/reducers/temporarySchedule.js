import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    temporarySchedules: [],
    temporarySchedule: {},
    teacherId: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_TEMPORARY_SCHEDULE:
            return updateObject(state, {
                temporarySchedules: state.temporarySchedules.concat(action.result)
            });
        case actionTypes.GET_TEMPORARY_SCHEDULES:
            return updateObject(state, {
                temporarySchedules: action.result
            });
        case actionTypes.DELETE_TEMPORARY_SCHEDULE:
            state.temporarySchedules = state.temporarySchedules.filter(
                temporarySchedule => temporarySchedule.id !== action.result
            );
            return updateObject(state, {
                temporarySchedules: state.temporarySchedules
            });
        case actionTypes.SELECT_TEMPORARY_SCHEDULE:
            let temporarySchedule = state.temporarySchedules.filter(
                temporarySchedule => temporarySchedule.id === action.result
            )[0];
            if (!temporarySchedule) {
                temporarySchedule = { id: null };
            }
            return updateObject(state, {
                temporarySchedule: temporarySchedule
            });
        case actionTypes.UPDATE_TEMPORARY_SCHEDULE:
            const updatedLessonChanges = [];
            state.temporarySchedules.forEach(temporarySchedule => {
                if (temporarySchedule.id === action.result.id) {
                    temporarySchedule = { ...temporarySchedule, ...action.result };
                }
                updatedLessonChanges.push(temporarySchedule);
            });
            return updateObject(state, {
                temporarySchedules: updatedLessonChanges,
                change: {}
            });
        case actionTypes.SELECT_TEACHER_ID:
            return updateObject(state, {
                temporarySchedule: {},
                teacherId: action.result
            });
        default:
            return state;
    }
};

export default reducer;
