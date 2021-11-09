import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

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
                rooms: [...state.rooms, action.room].sort((a, b) => a.name.localeCompare(b.name)),
            });
        case actionTypes.DELETE_ROOM:
            if (action.isDisabled) {
                return updateObject(state, {
                    disabledRooms: [
                        ...state.disabledRooms.filter((room) => room.id !== action.roomId),
                    ],
                });
            }
            return updateObject(state, {
                rooms: [...state.rooms.filter((room) => room.id !== action.roomId)],
            });

        case actionTypes.SHOW_LIST_OF_ROOMS_SUCCESS:
            return updateObject(state, {
                rooms: [...action.rooms],
            });
        case actionTypes.SET_DISABLED_ROOMS:
            return updateObject(state, {
                disabledRooms: [...action.rooms],
            });
        case actionTypes.SET_SELECT_ROOM: {
            const room = state.rooms.find((roomItem) => roomItem.id === action.roomId);
            return updateObject(state, {
                oneRoom: room,
            });
        }
        case actionTypes.UPDATE_ROOM: {
            const roomState = [...state.rooms];
            roomState[roomState.findIndex((roomItem) => roomItem.id === action.room.id)] =
                action.room;
            return updateObject(state, {
                oneRoom: {},
                rooms: [...roomState],
            });
        }
        case actionTypes.CLEAR_ROOM:
            return updateObject(state, {
                oneRoom: {},
            });

        default:
            return state;
    }
};

export default reducer;
