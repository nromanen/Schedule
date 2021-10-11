import * as actionTypes from './actionsType';

export const showAllGroups = (res) => {
    return {
        type: actionTypes.SHOW_ALL_GROUPS,
        result: res,
    };
};

export const setDisabledGroups = (res) => {
    return {
        type: actionTypes.SET_DISABLED_GROUPS,
        result: res,
    };
};

export const addGroup = (res) => {
    return {
        type: actionTypes.ADD_GROUP,
        result: res,
    };
};

export const deleteGroup = (res) => {
    return {
        type: actionTypes.DELETE_GROUP,
        result: res,
    };
};

export const selectGroup = (res) => {
    return {
        type: actionTypes.SELECT_GROUP,
        result: res,
    };
};

export const updateGroup = (res) => {
    return {
        type: actionTypes.UPDATE_GROUP,
        result: res,
    };
};

export const clearGroup = () => ({
    type: actionTypes.CLEAR_GROUP,
});
