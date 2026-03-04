import * as actionTypes from '../actions/actionsType';

const reducer = (
    state = {
        classScheduler: [],
    },
    action,
) => {
    switch (action.type) {
        case actionTypes.GET_CLASS_SCHEDULE_LIST_SUCCESS: {
            return { ...state, classScheduler: [...action.classScheduler] };
        }
        case actionTypes.GET_PUBLIC_CLASS_SCHEDULE_LIST_SUCCESS:
            return { ...state, classScheduler: [...action.classScheduler] };

        default:
            return state;
    }
};
export default reducer;
