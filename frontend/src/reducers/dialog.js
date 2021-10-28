import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    isOpenConfirmDialog: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_IS_OPEN_CONFIRM_DIALOG:
            return updateObject(state, {
                isOpenConfirmDialog: action.result,
            });
        default:
            return state;
    }
};

export default reducer;
