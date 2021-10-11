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

        case actionTypes.GET_ALL_ROOM_TYPES:
            return updateObject(state, {
                roomTypes: [...action.result],
            });
        case actionTypes.DELETE_TYPE:
            return updateObject(state, {
                roomTypes: [
                    ...state.roomTypes.filter((roomTypess) => roomTypess.id !== action.result),
                ],
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
        case actionTypes.GET_ONE_NEW_TYPE: {
            const one = state.roomTypes.find((roomTypeItem) => roomTypeItem.id === action.result);
            return updateObject(state, {
                oneType: one,
            });
        }
        default:
            return state;
    }
};

export default reducer;
