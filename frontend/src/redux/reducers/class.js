import * as actionTypes from '../actions/actionsType';

const classActions = (
    state = {
        classScheduler: [],
        classScheduleOne: {},
    },
    action,
) => {
    switch (action.type) {
        case actionTypes.SET_CLASS_SCHEDULE_LIST:
            return {
                ...state,
                classScheduler: [...action.classScheduler],
            };
        case actionTypes.ADD_CLASS_SCHEDULE_ONE:
            return {
                ...state,
                classScheduleOne: {},
                classScheduler: [...state.classScheduler, action.classSchedulOne],
            };
        case actionTypes.GET_CLASS_SCHEDULE_LIST:
            return state;
        case actionTypes.GET_CLASS_SCHEDULE_ONE:
            const one = state.classScheduler.filter(
                (classScheduleItem) => classScheduleItem.id === action.classSchedulOne,
            );
            return {
                ...state,
                classScheduleOne: one[0],
            };
        case actionTypes.DELETE_CLASS_SCHEDULE_ONE:
            return {
                ...state,
                classScheduler: state.classScheduler.filter(
                    (classScheduleItem) => classScheduleItem.id !== action.classSchedulOne,
                ),
            };
        case actionTypes.UPDATE_CLASS_SCHEDULE_ONE:
            const classSchedulerstate = [...state.classScheduler];
            classSchedulerstate[
                classSchedulerstate.findIndex(
                    (classItem) => classItem.id === action.classSchedulOne.id,
                )
            ] = action.classSchedulOne;
            return {
                ...state,
                classScheduleOne: {},
                classScheduler: [...classSchedulerstate],
            };
        case actionTypes.CLEAR_CLASS_SCHEDULE_ONE:
            return {
                ...state,
                classScheduleOne: {},
            };
        default:
            return state;
    }
};
export default classActions;
