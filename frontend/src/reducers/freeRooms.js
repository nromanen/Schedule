import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const reducer = (
    state = {
        freeRooms: [],
        freeRoom: {},
    },
    action,
) => {
    switch (action.type) {
        case 'SHOW_FREE_ROOMS':
            return updateObject(state, {
                freeRooms: action.result,
            });
        case actionTypes.CLEAR_FREE_ROOM:
            return updateObject(state, {
                freeRoom: {},
            });
        default:
            return state;
    }
};

export default reducer;
