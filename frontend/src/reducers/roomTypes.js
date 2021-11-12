import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const reducer = (
    state = {
        roomTypes: [],
        oneType: {},
    },
    action,
) => {
    switch (action.type) {
        case actionTypes.ADD_ROOM_TYPE:
            return updateObject(state, {
                roomTypes: [...state.roomTypes, action.roomType],
            });

        case actionTypes.GET_ALL_ROOM_TYPES:
            return updateObject(state, {
                roomTypes: [...action.roomType],
            });
        case actionTypes.DELETE_ROOM_TYPE:
            return updateObject(state, {
                roomTypes: [...state.roomTypes.filter((type) => type.id !== action.roomTypeId)],
            });

        case actionTypes.UPDATE_ROOM_TYPE: {
            const updateTypeState = [...state.roomTypes];
            updateTypeState[
                updateTypeState.findIndex((typeItem) => typeItem.id === action.roomType.id)
            ] = action.roomType;
            return updateObject(state, {
                oneType: {},
                roomTypes: [...updateTypeState],
            });
        }
        case actionTypes.SELECT_ROOM_TYPE: {
            const type = state.roomTypes.find((roomType) => roomType.id === action.typeId);
            return updateObject(state, {
                oneType: type,
            });
        }
        default:
            return state;
    }
};

export default reducer;
