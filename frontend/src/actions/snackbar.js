import * as actionTypes from './actionsType';

export const setOpenSnackbar = (res) => {
    return {
        type: actionTypes.SET_OPEN_SNACKBAR,
        result: res,
    };
};
