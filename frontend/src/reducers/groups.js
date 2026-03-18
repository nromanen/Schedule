import * as actionTypes from '../actions/actionsType';
import {sortGroups} from '../helper/sortGroup';

const initialState = {
    groups: [],
    scheduleGroups: [],
    group: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_ALL_GROUPS_SUCCESS:
            return {
                ...state,
                groups: action.payload,
            };

        case actionTypes.SELECT_GROUP_SUCCESS: {
            let selectedGroup = state.scheduleGroups.find((group) => group.id === +action.id)
                || state.groups.find((group) => group.id === +action.id);
            if (!selectedGroup) {
                selectedGroup = { id: null };
            }
            return {
                ...state,
                group: selectedGroup,
            };
        }

        case actionTypes.SET_SCHEDULE_GROUPS:
            return {
                ...state,
                scheduleGroups: action.payload,
            };

        default:
            return state;
    }
};

export default reducer;
