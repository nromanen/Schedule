import * as actionsType from './actionsType';

export const showFreeRooms = (freeRooms) => {
    return {
        type: 'SHOW_FREE_ROOMS',
        result: freeRooms,
    };
};

export const clearFreeRooms = () => ({
    type: actionsType.CLEAR_FREE_ROOM,
});
