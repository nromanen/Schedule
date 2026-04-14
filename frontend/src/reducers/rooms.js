import * as actionTypes from '../actions/actionsType';

const initialState = {
    rooms: [],
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_LIST_OF_ROOMS_SUCCESS:
            return { ...state, rooms: [...action.rooms] };
        default:
            return state;
    }
};

export default reducer;
