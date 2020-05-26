import * as actionsType from './actionsType';

export const addRoom = room => {
    return {
        type: actionsType.ADD_ROOM,
        result: room
    };
};

export const deleteRoom = id => {
    return {
        type: actionsType.DELETE_ROOM,
        result: id
    };
};

export const showListOfRooms = rooms => {
    return {
        type: actionsType.SHOW_LIST_OF_ROOMS,
        result: rooms
    };
};

export const  setDisabledRooms = rooms => {
    return {
        type: actionsType.SET_DISABLED_ROOMS,
        result: rooms
    };
};

export const selectOneRoom = id => {
    return {
        type: actionsType.SELECT_ONE_ROOM,
        result: id
    };
};

export const updateOneRoom = room => {
    return {
        type: actionsType.UPDATE_ONE_ROOM,
        result: room
    };
};

export const clearRoomOne = () => ({
    type: actionsType.CLEAR_ROOM_ONE
});


