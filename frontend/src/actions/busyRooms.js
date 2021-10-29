import * as actionTypes from './actionsType';

export const getAllBusyRoomsSuccess = (rooms) => {
    return {
        type: actionTypes.GET_BUSY_ROOMS_SUCCESS,
        rooms,
    };
};
