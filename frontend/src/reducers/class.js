import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const reducer = (
    state = {
        classScheduler: [],
        classScheduleOne: {},
    },
    action,
) => {
    switch (action.type) {
        case actionTypes.SET_CLASS_SCHEDULE_LIST: {
            return updateObject(state, {
                classScheduler: [...action.classScheduler],
            });
        }
        case actionTypes.ADD_CLASS_SCHEDULE_ONE: {
            return updateObject(state, {
                classScheduleOne: {},
                classScheduler: [...state.classScheduler, action.classSchedulOne],
            });
        }
        case actionTypes.GET_CLASS_SCHEDULE_LIST:
            return state;
        case actionTypes.GET_CLASS_SCHEDULE_ONE: {
            const one = state.classScheduler.find(
                (classScheduleItem) => classScheduleItem.id === action.classSchedulOne,
            );
            return updateObject(state, {
                classScheduleOne: one,
            });
        }
        case actionTypes.DELETE_CLASS_SCHEDULE_ONE: {
            return {
                ...state,
                classScheduler: state.classScheduler.filter(
                    (classScheduleItem) => classScheduleItem.id !== action.classSchedulOne,
                ),
            };
        }
        case actionTypes.UPDATE_CLASS_SCHEDULE_ONE: {
            const classSchedulerstate = [...state.classScheduler];
            classSchedulerstate[
                classSchedulerstate.findIndex(
                    (classItem) => classItem.id === action.classSchedulOne.id,
                )
            ] = action.classSchedulOne;
            return updateObject(state, {
                classScheduleOne: {},
                classScheduler: [...classSchedulerstate],
            });
        }
        case actionTypes.CLEAR_CLASS_SCHEDULE_ONE: {
            return updateObject(state, {
                classScheduleOne: {},
            });
        }
        default:
            return state;
    }
};
export default reducer;
