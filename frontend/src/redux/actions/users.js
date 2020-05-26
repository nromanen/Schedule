import * as actionTypes from './actionsType';

export const setUsers = res => {
    return {
        type: actionTypes.SET_USERS,
        result: res
    };
};

