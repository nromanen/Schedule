import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    groups: [],
    group: {},
    disabledGroups: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_GROUP:
            return updateObject(state, {
                groups: state.groups.concat(action.result),
            });

        case actionTypes.DELETE_GROUP: {
            const groups = state.groups.filter((group) => group.id !== action.result);
            return updateObject(state, {
                groups,
            });
        }

        case actionTypes.SHOW_ALL_GROUPS:
            return updateObject(state, {
                ...state,
                groups: action.result,
            });
        case actionTypes.SET_DISABLED_GROUPS:
            return updateObject(state, {
                ...state,
                disabledGroups: action.result,
            });

        case actionTypes.SELECT_GROUP: {
            let selectedGroup = state.groups.filter(
                (group) => group.id === Number(action.result),
            )[0];

            if (!selectedGroup) {
                selectedGroup = { id: null };
            }
            return updateObject(state, {
                group: selectedGroup,
            });
        }
        case actionTypes.UPDATE_GROUP: {
            const updatedGroups = state.groups.map((group) => {
                if (group.id === action.result.id) {
                    return { ...group, ...action.result };
                }
                return group;
            });
            return updateObject(state, {
                groups: updatedGroups,
                group: {},
            });
        }

        case actionTypes.CLEAR_GROUP:
            return updateObject(state, {
                group: {},
            });

        default:
            return state;
    }
};

export default reducer;
