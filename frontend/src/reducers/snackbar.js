import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    isSnackbarOpen: false,
    snackbarType: null,
    message: null,
};

const reducer = (state = initialState, action) => {
    if (action.type === actionTypes.SET_OPEN_SNACKBAR) {
        const { type, message, isOpen } = action.result;
        return updateObject(state, {
            isSnackbarOpen: isOpen,
            snackbarType: type,
            message,
        });
    }
    return state;
};

export default reducer;
