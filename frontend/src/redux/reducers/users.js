import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    users: [],
    user: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USERS:
            return updateObject(state, {
                users: action.result
            });
        case actionTypes.SET_USER:
            return updateObject(state, {
                user: action.result
            });
        default:
            return state;
    }
};

export default reducer;
