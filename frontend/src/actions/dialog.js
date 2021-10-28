import * as actionTypes from './actionsType';

export const setIsOpenConfirmDialog = (res) => {
    return {
        type: actionTypes.SET_IS_OPEN_CONFIRM_DIALOG,
        result: res,
    };
};
