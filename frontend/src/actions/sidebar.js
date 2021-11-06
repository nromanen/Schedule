import * as actionTypes from './actionsType';

export const toggleDisabled = (res) => {
    return {
        type: actionTypes.TOGGLE_DISABLED,
        res,
    };
};

export const setSearchDisabled = (res) => {
    return {
        type: actionTypes.SET_SEARCH_NAME,
        res,
    };
};
