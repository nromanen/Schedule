import * as actionTypes from './actionsType';

export const addGroup = (res) => {
    return {
        type: actionTypes.ADD_GROUP,
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

// done


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

export const deleteGroup = (res) => {
    return {
        type: actionTypes.DELETE_GROUP,
        result: res,
    };
};

// saga new

export const asyncFetchDisabledGroups = () => ({
    type: actionTypes.FETCH_DISABLED_GROUPS,
});

export const asyncFetchEnabledGroups = () => ({
    type: actionTypes.FETCH_ENABLED_GROUPS,
});

export const asyncDeleteGroup = (id) => ({
    type: actionTypes.ASYNC_DELETE_GROUP,
    id,
});

export const asyncCreateGroup = (data) => ({
    type: actionTypes.ASYNC_CREATE_GROUP,
    data,
});
