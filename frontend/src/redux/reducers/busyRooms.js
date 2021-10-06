import * as actionTypes from '../actions/actionsType';

const busyRooms = (
    state = {
        busyRooms: [],
    },
    action,
) => {
    switch (action.type) {
        case actionTypes.SHOW_ALL_BUSY_ROOMS:
            return {
                ...state,
                busyRooms: [action.result],
            };

        default:
            return state;
    }
};

export default busyRooms;
