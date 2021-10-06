import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    isSnackbarOpen: false,
    snackbarType: null,
    message: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_OPEN_SNACKBAR:
            const { type } = action.result;
            const { message } = action.result;
            return updateObject(state, {
                isSnackbarOpen: action.result.isOpen,
                snackbarType: type,
                message,
            });
        default:
            return state;
    }
};

export default reducer;
