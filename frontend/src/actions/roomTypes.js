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

export const deleteType = (roomType) => {
    return {
        type: actionsType.DELETE_TYPE,
        result: roomType,
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
