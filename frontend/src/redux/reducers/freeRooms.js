import * as actionTypes from '../actions/actionsType';
import actions from 'redux-form/lib/actions';

const freeRooms = (
    state = {
        freeRooms : [],
        freeRoom : {}
    }, 
    action
) => {
    switch(action.type) {
        case actionTypes.SHOW_FREE_ROOMS:
            return {
                ...state,
                freeRooms: action.result
            };
        case actionTypes.CLEAR_FREE_ROOM:
            return {
                ...state,
                freeRoom: {}
            };
        default:
            return state;    
    }
};

export default freeRooms;