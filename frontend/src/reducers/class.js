import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const reducer = (
    state = {
        classScheduler: [],
        classSchedule: {},
    },
    action,
) => {
    switch (action.type) {
        case actionTypes.GET_CLASS_SCHEDULE_LIST_SUCCESS: {
            return updateObject(state, {
                classScheduler: [...action.classScheduler],
            });
        }
        case actionTypes.ADD_CLASS_SCHEDULE_SUCCESS: {
            return updateObject(state, {
                classSchedule: {},
                classScheduler: [...state.classScheduler, action.classSchedule],
            });
        }
        case actionTypes.GET_PUBLIC_CLASS_SCHEDULE_LIST_SUCCESS:
            return state;
        // case actionTypes.GET_CLASS_SCHEDULE_LIST: {
        //     console.log(action);
        //     return updateObject(state, {
        //         classScheduler: action.classScheduler,
        //     });
        // }
        case actionTypes.GET_CLASS_SCHEDULE_BY_ID_SUCCESS: {
            const one = state.classScheduler.find(
                (classScheduleItem) => classScheduleItem.id === action.id,
            );
            return updateObject(state, {
                classSchedule: one,
            });
        }
        case actionTypes.DELETE_CLASS_SCHEDULE_SUCCESS: {
            return updateObject(state, {
                classScheduler: state.classScheduler.filter(
                    (classScheduleItem) => classScheduleItem.id !== action.id,
                ),
            });
        }
        case actionTypes.UPDATE_CLASS_SCHEDULE_SUCCESS: {
            const classSchedulerstate = [...state.classScheduler];
            classSchedulerstate[
                classSchedulerstate.findIndex(
                    (classItem) => classItem.id === action.classSchedule.id,
                )
            ] = action.classSchedule;
            return updateObject(state, {
                classSchedule: {},
                classScheduler: [...classSchedulerstate],
            });
        }
        case actionTypes.CLEAR_CLASS_SCHEDULE_SUCCESS: {
            return updateObject(state, {
                classSchedule: {},
            });
        }
        default:
            return state;
    }
};
export default reducer;
