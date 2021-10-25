import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    groups: [],
    group: {},
    disabledGroups: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
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

        case actionTypes.ADD_GROUP:
            return updateObject(state, {
                groups: state.groups.concat(action.result),
            });

        case actionTypes.UPDATE_GROUP: {
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

        case actionTypes.DELETE_GROUP: {
            const groups = state.groups.filter((group) => group.id !== action.result);
            const disabledGroups = state.disabledGroups.filter(
                (group) => group.id !== action.result,
            );
            return updateObject(state, {
                groups,
                disabledGroups,
            });
        }

        case actionTypes.SELECT_GROUP: {
            let selectedGroup = state.groups.find((group) => group.id === Number(action.result));
            if (!selectedGroup) {
                selectedGroup = { id: null };
            }
            return updateObject(state, {
                group: selectedGroup,
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
