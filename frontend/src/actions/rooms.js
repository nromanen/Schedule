import * as actionsType from './actionsType';

export const addRoom = (room) => {
    return {
        type: actionsType.ADD_ROOM,
        result: room,
    };
};
export const addRoomStart = (room) => {
    return {
        type: actionsType.ADD_ROOM_START,
        room,
    };
};

export const deleteRoom = (id) => {
    return {
        type: actionsType.DELETE_ROOM,
        result: id,
    };
};

export const getListOfRoomsSuccess = (rooms) => {
    return {
        type: actionsType.SHOW_LIST_OF_DISABLED_ROOMS_SUCCESS,
        rooms,
    };
};

export const getListOfRoomsStart = (rooms) => {
    return {
        type: actionsType.GET_LIST_OF_ROOMS_START,
        rooms,
    };
};

export const getListOfDisabledRoomsSuccess = (rooms) => {
    return {
        type: actionsType.SET_DISABLED_ROOMS,
        result: rooms,
    };
};
export const getListOfDisabledRoomsStart = (rooms) => {
    return {
        type: actionsType.GET_LIST_OF_DISABLED_ROOMS_START,
        rooms,
    };
};

export const selectOneRoom = (id) => {
    return {
        type: actionsType.SELECT_ONE_ROOM,
        result: id,
    };
};

export const updateOneRoom = (room) => {
    return {
        type: actionsType.UPDATE_ONE_ROOM,
        result: room,
    };
};
export const updateRoomStart = (room) => {
    return {
        type: actionsType.UPDATE_ROOM_START,
        room,
    };
};

export const clearRoomOne = () => ({
    type: actionsType.CLEAR_ROOM_ONE,
});

export const handleRoomFormSubmitStart = (values) => {
    return {
        type: actionsType.HANDLE_ROOM_FORM_SUBMIT_START,
        values,
    };
};
