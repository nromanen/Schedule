import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    groups: [],
    group: {},
    disabledGroups: []
};

const groups = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_GROUP:
            return updateObject(state, {
                groups: state.groups.concat(action.result),
                group: state.group
            });

        case actionTypes.DELETE_GROUP:
            state.groups = state.groups.filter(
                group => group.id !== action.result
            );
            return updateObject(state, {
                groups: state.groups,
                group: state.group
            });

        case actionTypes.SHOW_ALL_GROUPS:
            return updateObject(state, {
                ...state,
                groups: action.result
            });
        case actionTypes.SET_DISABLED_GROUPS:
            return updateObject(state, {
                ...state,
                disabledGroups: action.result
            });

        case actionTypes.SELECT_GROUP:
            console.log("SELECT_GROUP",action.result,state.groups)
            let group = state.groups.filter(
                group => group.id === Number(action.result)
            )[0];

            if (!group) {
                group = { id: null };
            }
            return updateObject(state, {
                groups: state.groups,
                group: group
            });

        case actionTypes.UPDATE_GROUP:
            const updatedGroups = [];
            state.groups.forEach(group => {
                if (group.id === action.result.id) {
                    group = { ...group, ...action.result };
                }
                updatedGroups.push(group);
            });
            return updateObject(state, {
                groups: updatedGroups,
                group: {}
            });

        case actionTypes.CLEAR_GROUP:
            return {
                ...state,
                group: {}
            };

        default:
            return state;
    }
};

export default groups;
