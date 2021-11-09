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
        case actionTypes.POST_NEW_TYPE:
            return updateObject(state, {
                roomTypes: [...state.roomTypes, action.result],
            });

        case actionTypes.GET_ALL_ROOM_TYPES_SUCCESS:
            return updateObject(state, {
                roomTypes: [...action.roomType],
            });
        case actionTypes.DELETE_ROOM_TYPE_SUCCESS:
            return updateObject(state, {
                roomTypes: [...state.roomTypes.filter((type) => type.id !== action.roomTypeId)],
            });

        case actionTypes.UPDATE_ONE_TYPE: {
            const updateTypeState = [...state.roomTypes];
            updateTypeState[
                updateTypeState.findIndex((typeItem) => typeItem.id === action.result.id)
            ] = action.result;
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
