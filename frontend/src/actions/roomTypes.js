import * as actionsType from './actionsType';

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
