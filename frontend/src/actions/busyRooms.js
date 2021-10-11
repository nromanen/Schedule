import * as actionsType from './actionsType';

export const showAllBusyRooms = (data) => {
    return {
        type: actionsType.SHOW_ALL_BUSY_ROOMS,
        result: data,
    };
};
