import * as actionsType from './actionsType';

export const postOneType = (roomType) => {
    return {
        type: actionsType.POST_NEW_TYPE,
        result: roomType,
    };
};

export const getAllRoomTypesSuccess = (roomType) => {
    return {
        type: actionsType.GET_ALL_ROOM_TYPES_SUCCESS,
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
        type: actionsType.DELETE_ROOM_TYPE_SUCCESS,
        roomTypeId,
    };
};

export const deleteRoomTypeStart = (roomTypeId) => {
    return {
        type: actionsType.DELETE_ROOM_TYPE_START,
        roomTypeId,
    };
};

export const updateOneType = (roomType) => {
    return {
        type: actionsType.UPDATE_ONE_TYPE,
        result: roomType,
    };
};

export const selectRoomType = (typeId) => {
    return {
        type: actionsType.SELECT_ROOM_TYPE,
        typeId,
    };
};
