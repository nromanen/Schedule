import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

function compare(a, b) {
    let comparison = 0;
    if (a.name > b.name) {
        comparison = 1;
    } else if (a.name < b.name) {
        comparison = -1;
    }
    return comparison;
}
const reducer = (
    state = {
        rooms: [],
        oneRoom: {},
        disabledRooms: [],
    },
    action,
) => {
    switch (action.type) {
        case actionTypes.ADD_ROOM:
            return updateObject(state, {
                oneRoom: {},
                rooms: [...state.rooms, action.result].sort(compare),
            });
        case actionTypes.DELETE_ROOM:
            if (action.isDisabled) {
                return updateObject(state, {
                    disabledRooms: [...state.disabledRooms.filter((room) => room.id !== action.id)],
                });
            }
            return updateObject(state, {
                rooms: [...state.rooms.filter((room) => room.id !== action.id)],
            });

        case actionTypes.SHOW_LIST_OF_ROOMS_SUCCESS:
            return updateObject(state, {
                rooms: [...action.rooms],
            });
        case actionTypes.SET_DISABLED_ROOMS:
            return updateObject(state, {
                disabledRooms: [...action.result],
            });
        case actionTypes.SELECT_ONE_ROOM: {
            const one = state.rooms.find((roomItem) => roomItem.id === action.result);
            return updateObject(state, {
                oneRoom: one,
            });
        }
        case actionTypes.UPDATE_ONE_ROOM: {
            const roomState = [...state.rooms];
            roomState[roomState.findIndex((roomItem) => roomItem.id === action.result.id)] =
                action.result;
            return updateObject(state, {
                oneRoom: {},
                rooms: [...roomState],
            });
        }
        case actionTypes.CLEAR_ROOM_ONE:
            return updateObject(state, {
                oneRoom: {},
            });

        default:
            return state;
    }
};

export default reducer;
