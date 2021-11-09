import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const reducer = (
    state = {
        rooms: [],
        disabledRooms: [],
        roomTypes: [],
        oneRoom: {},
        oneType: {},
        freeRooms: [],
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
        case actionTypes.GET_FREE_ROOMS_SUCCESS: {
            return updateObject(state, {
                freeRooms: action.freeRooms,
            });
        }
        default:
            return state;
    }
};

export default reducer;
