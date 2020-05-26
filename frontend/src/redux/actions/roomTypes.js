import * as actionsType from './actionsType';
import roomTypes from '../reducers/roomTypes';
import actions from 'redux-form/lib/actions';

export const postOneType = roomType => {
    return {
        type: actionsType.POST_NEW_TYPE,
        result: roomType
    };
};

export const getAllRoomTypes = roomType => {
    return {
        type: actionsType.GET_ALL_ROOM_TYPES,
        result: roomType
    };
};

export const deleteType = roomType => {
    return {
        type: actionsType.DELETE_TYPE,
        result: roomType
    };


};

export const updateOneType = roomType => {
    return {
        type: actionsType.UPDATE_ONE_TYPE,
        result: roomType
    };
};

export const getOneNewType = roomType => {
    return {
        type: actionsType.GET_ONE_NEW_TYPE,
        result: roomType
    }
}




