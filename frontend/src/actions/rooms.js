import * as actionsType from './actionsType';

export const getListOfRoomsSuccess = (rooms) => ({
    type: actionsType.SHOW_LIST_OF_ROOMS_SUCCESS,
    rooms,
});

export const getListOfRoomsStart = () => ({
    type: actionsType.GET_LIST_OF_ROOMS_START,
});

