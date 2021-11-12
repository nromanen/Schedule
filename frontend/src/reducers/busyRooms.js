import * as actionTypes from '../actions/actionsType';

const busyRooms = (
    state = {
        busyRooms: [],
    },
    action,
) => {
    if (action.type === actionTypes.GET_BUSY_ROOMS_SUCCESS) {
        return { ...state, busyRooms: [action.rooms] };
    }
    return state;
};

export default busyRooms;
