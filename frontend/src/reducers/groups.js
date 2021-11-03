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
            const newGroup = action.result.sort((a, b) => sortGroup(a, b));
            return updateObject(state, {
                ...state,
                groups: newGroup,
            });
        }

        case actionTypes.FETCH_GROUP_BY_ID_SUCCESS: {
            return updateObject(state, {
                ...state,
                group: action.group,
            });
        }

        case actionTypes.CREATE_GROUP_SUCCESS:
            return updateObject(state, {
                groups: state.groups.concat(action.result),
            });

        case actionTypes.UPDATE_GROUP_SUCCESS: {
            const groupIndex = state.groups.findIndex(({ id }) => id === action.result.id);
            const groups = [...state.groups];

            groups[groupIndex] = {
                ...groups[groupIndex],
                ...action.result,
            };

            return updateObject(state, {
                groups,
                group: {},
            });
        }

        case actionTypes.DELETE_GROUP_SUCCESS: {
            const groups = state.groups.filter((group) => group.id !== action.result);
            return updateObject(state, {
                groups,
            });
        }

        case actionTypes.SELECT_GROUP_SUCCESS: {
            let selectedGroup = state.groups.find((group) => group.id === Number(action.result));
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
