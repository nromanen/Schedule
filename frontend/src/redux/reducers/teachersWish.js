import * as actionTypes from '../actions/actionsType';

const teachersWish = (
    state = {
        wishes: [],
        wish: {},
        myWishes: {},
    },
    action,
) => {
    switch (action.type) {
        case actionTypes.SELECT_WISH:
            let wish = state.wishes[0].find((wish) => wish.day_of_week === action.result);

            if (!wish) {
                wish = { day_of_week: null };
            }
            return {
                ...state,
                wishes: state.wishes,
                wish,
            };

        case actionTypes.SHOW_ALL_WISH:
            return {
                ...state,
                wishes: [action.result],
                wish: {},
            };
        case actionTypes.SET_MY_TEACHER_WISHES:
            return {
                ...state,
                wish: {},
                myWishes: action.result,
            };

        default:
            return state;
    }
};

export default teachersWish;
