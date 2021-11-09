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

export const deleteRoom = (id, isDisabled) => {
    return {
        type: actionsType.DELETE_ROOM,
        id,
        isDisabled,
    };
};

export const getListOfRoomsSuccess = (rooms) => {
    return {
        type: actionsType.SHOW_LIST_OF_ROOMS_SUCCESS,
        rooms,
    };
};

export const getListOfRoomsStart = () => {
    return {
        type: actionsType.GET_LIST_OF_ROOMS_START,
    };
};

export const getListOfDisabledRoomsSuccess = (rooms) => {
    return {
        type: actionsType.SET_DISABLED_ROOMS,
        result: rooms,
    };
};
export const getListOfDisabledRoomsStart = () => {
    return {
        type: actionsType.GET_LIST_OF_DISABLED_ROOMS_START,
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
export const updateRoomStart = (values) => {
    return {
        type: actionsType.UPDATE_ROOM_START,
        values,
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
export const toggleRoomVisibilityStart = (room, isDisabled) => {
    return {
        type: actionsType.TOGGLE_ROOM_VISIBILITY_START,
        room,
        isDisabled,
    };
};
