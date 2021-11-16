import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';
import { sortGroup } from '../helper/sortGroup';

const initialState = {
    groups: [],
    group: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_ALL_GROUPS_SUCCESS: {
            return updateObject(state, {
                ...state,
                groups: action.res,
            });
        }

        case actionTypes.GET_GROUP_BY_ID_SUCCESS: {
            return updateObject(state, {
                ...state,
                group: action.group,
            });
        }

        case actionTypes.CREATE_GROUP_SUCCESS: {
            return updateObject(state, {
                groups: [action.data, ...state.groups],
            });
        }

        case actionTypes.UPDATE_GROUP_SUCCESS: {
            const groupIndex = state.groups.findIndex(({ id }) => id === action.group.id);
            const groups = [...state.groups];

            groups[groupIndex] = {
                ...groups[groupIndex],
                ...action.group,
            };
            const sortedGroups = groups.sort((a, b) => sortGroup(a, b));

            return updateObject(state, {
                groups: sortedGroups,
                group: {},
            });
        }

        case actionTypes.DELETE_GROUP_SUCCESS: {
            const groups = state.groups.filter((group) => group.id !== action.id);
            return updateObject(state, {
                groups,
            });
        }

        case actionTypes.SELECT_GROUP_SUCCESS: {
            let selectedGroup = state.groups.find((group) => group.id === +action.result);
            if (!selectedGroup) {
                selectedGroup = { id: null };
            }
            return updateObject(state, {
                group: selectedGroup,
            });
        }

        case actionTypes.CLEAR_GROUP_SUCCESS:
            return updateObject(state, {
                group: {},
            });

        default:
            return state;
    }
};

export default reducer;
