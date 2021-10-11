import * as actionTypes from '../actions/actionsType';

const busyRooms = (
    state = {
        busyRooms: [],
    },
    action,
) => {
    if (action.type === actionTypes.SHOW_ALL_BUSY_ROOMS) {
        return { ...state, busyRooms: [action.result] };
    }
    return state;
};

export default busyRooms;
