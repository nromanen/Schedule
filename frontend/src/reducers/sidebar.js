import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    isDisabled: false,
    searchName: '',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_DISABLED:
            return updateObject(state, {
                isDisabled: action.res,
            });
        case actionTypes.SET_SEARCH_NAME:
            return updateObject(state, {
                searchName: action.res,
            });
        default:
            return state;
    }
};

export default reducer;
