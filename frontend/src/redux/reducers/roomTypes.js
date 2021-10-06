import actions from 'redux-form/lib/actions';
import * as actionTypes from '../actions/actionsType';
import { actionType } from '../../constants/actionTypes';

const roomTypes = (
    state = {
        roomTypes: [],
        oneType: {},
    },
    action,
) => {
    switch (action.type) {
        case actionTypes.POST_NEW_TYPE:
            return {
                ...state,
                roomTypes: [...state.roomTypes, action.result],
            };

        case actionTypes.GET_ALL_ROOM_TYPES:
            return {
                ...state,
                roomTypes: [...action.result],
            };
        case actionTypes.DELETE_TYPE:
            return {
                ...state,
                roomTypes: [
                    ...state.roomTypes.filter((roomTypes) => roomTypes.id !== action.result),
                ],
            };

        case actionTypes.UPDATE_ONE_TYPE:
            const updateTypeState = [...state.roomTypes];
            updateTypeState[
                updateTypeState.findIndex((typeItem) => typeItem.id === action.result.id)
            ] = action.result;
            return {
                ...state,
                oneType: {},
                roomTypes: [...updateTypeState],
            };
        case actionTypes.GET_ONE_NEW_TYPE:
            const one = state.roomTypes.filter((roomTypeItem) => roomTypeItem.id === action.result);
            return {
                ...state,
                oneType: one[0],
            };
        default:
            return state;
    }
};

export default roomTypes;
