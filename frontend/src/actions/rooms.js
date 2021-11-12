import * as actionsType from './actionsType';

export const addRoomSuccess = (room) => {
    return {
        type: actionsType.ADD_ROOM,
        room,
    };
};
export const addRoomStart = (room) => {
    return {
        type: actionsType.ADD_ROOM_START,
        room,
    };
};

export const deleteRoomSuccess = (roomId, isDisabled) => {
    return {
        type: actionsType.DELETE_ROOM,
        roomId,
        isDisabled,
    };
};

export const deleteRoomStart = (roomId, isDisabled) => {
    return {
        type: actionsType.DELETE_ROOM_START,
        roomId,
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
        rooms,
    };
};
export const getListOfDisabledRoomsStart = () => {
    return {
        type: actionsType.GET_LIST_OF_DISABLED_ROOMS_START,
    };
};

export const setSelectRoomSuccess = (roomId) => {
    return {
        type: actionsType.SET_SELECT_ROOM,
        roomId,
    };
};

export const updateRoomSuccess = (room) => {
    return {
        type: actionsType.UPDATE_ROOM,
        room,
    };
};
export const updateRoomStart = (values) => {
    return {
        type: actionsType.UPDATE_ROOM_START,
        values,
    };
};

export const clearRoomSuccess = () => ({
    type: actionsType.CLEAR_ROOM,
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

export const addRoomTypeSuccess = (roomType) => {
    return {
        type: actionsType.ADD_ROOM_TYPE,
        roomType,
    };
};

export const getAllRoomTypesSuccess = (roomType) => {
    return {
        type: actionsType.GET_ALL_ROOM_TYPES,
        roomType,
    };
};

export const getAllRoomTypesStart = () => {
    return {
        type: actionsType.GET_ALL_ROOM_TYPES_START,
    };
};

export const deleteRoomTypeSuccess = (roomTypeId) => {
    return {
        type: actionsType.DELETE_ROOM_TYPE,
        roomTypeId,
    };
};

export const deleteRoomTypeStart = (roomTypeId) => {
    return {
        type: actionsType.DELETE_ROOM_TYPE_START,
        roomTypeId,
    };
};

export const updateRoomTypeSuccess = (roomType) => {
    return {
        type: actionsType.UPDATE_ROOM_TYPE,
        roomType,
    };
};

export const selectRoomType = (typeId) => {
    return {
        type: actionsType.SELECT_ROOM_TYPE,
        typeId,
    };
};
export const handleRoomTypeFormSubmitStart = (values) => {
    return {
        type: actionsType.HANDLE_ROOM_TYPE_FORM_SUBMIT_START,
        values,
    };
};

export const getFreeRoomsStart = (params) => ({
    type: actionsType.GET_FREE_ROOMS_START,
    params,
});

export const getFreeRoomsSuccess = (freeRooms) => ({
    type: actionsType.GET_FREE_ROOMS_SUCCESS,
    freeRooms,
});

export const clearFreeRooms = () => ({
    type: actionsType.CLEAR_FREE_ROOMS,
});
export const getBusyRoomsStart = (semesterId) => ({
    type: actionsType.GET_BUSY_ROOMS_START,
    semesterId,
});

export const getBusyRoomsSuccess = (busyRooms) => ({
    type: actionsType.GET_BUSY_ROOMS_SUCCESS,
    busyRooms,
});
