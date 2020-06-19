import * as actionTypes from '../actions/actionsType';
function compare(a, b) {
    let comparison = 0;
    if (a.name > b.name) {
        comparison = 1;
    } else if (a.name < b.name) {
        comparison = -1;
    }
    return comparison;
}
const rooms = (
    state = {
        rooms: [],
        oneRoom: {},
        disabledRooms: []
    },
    action
) => {
    switch (action.type) {
        case actionTypes.ADD_ROOM:
            return {
                ...state,
                oneRoom: {},
                rooms: [...state.rooms, action.result].sort(compare)
            };
        case actionTypes.DELETE_ROOM:
            return {
                ...state,
                oneRoom: {},
                rooms: [
                    ...state.rooms.filter(rooms => rooms.id !== action.result)
                ]
            };

        case actionTypes.SHOW_LIST_OF_ROOMS:
            return {
                ...state,
                rooms: [...action.result]
            };
        case actionTypes.SET_DISABLED_ROOMS:
            return {
                ...state,
                disabledRooms: [...action.result]
            };
        case actionTypes.SELECT_ONE_ROOM:
            const one = state.rooms.filter(
                roomItem => roomItem.id === action.result
            );
            return {
                ...state,
                oneRoom: one[0]
            };
        case actionTypes.UPDATE_ONE_ROOM:
            let roomState = [...state.rooms];
            roomState[
                roomState.findIndex(
                    roomItem => roomItem.id === action.result.id
                )
            ] = action.result;
            return {
                ...state,
                oneRoom: {},
                rooms: [...roomState]
            };
        case actionTypes.CLEAR_ROOM_ONE:
            return {
                ...state,
                oneRoom: {}
            };

        default:
            return state;
    }
};

export default rooms;
