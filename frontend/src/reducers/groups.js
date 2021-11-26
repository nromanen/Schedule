import * as actionTypes from '../actions/actionsType';

const initialState = {
    groups: [],
    group: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_ALL_GROUPS_SUCCESS:
            return {
                ...state,
                groups: action.payload,
            };

        case actionTypes.GET_GROUP_BY_ID_SUCCESS:
            return {
                ...state,
                group: action.group,
            };

        case actionTypes.CREATE_GROUP_SUCCESS:
            return {
                ...state,
                groups: [action.group, ...state.groups],
            };

        case actionTypes.UPDATE_GROUP_SUCCESS: {
            const groupIndex = state.groups.findIndex(({ id }) => id === action.group.id);
            const groups = [...state.groups];

            groups[groupIndex] = {
                ...groups[groupIndex],
                ...action.group,
            };
            const sortedGroups = groups;

            return {
                ...state,
                groups: sortedGroups,
                group: {},
            };
        }

        case actionTypes.DELETE_GROUP_SUCCESS: {
            const groups = state.groups.filter((group) => group.id !== action.id);
            return {
                ...state,
                groups,
            };
        }

        case actionTypes.SELECT_GROUP_SUCCESS: {
            let selectedGroup = state.groups.find((group) => group.id === +action.id);
            if (!selectedGroup) {
                selectedGroup = { id: null };
            }
            return {
                ...state,
                group: selectedGroup,
            };
        }

        case actionTypes.CLEAR_GROUP_SUCCESS:
            return {
                ...state,
                group: {},
            };

        default:
            return state;
    }
};

export default reducer;
