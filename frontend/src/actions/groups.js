import * as actionTypes from './actionsType';

export const addGroup = (res) => {
    return {
        type: actionTypes.ADD_GROUP,
        result: res,
    };
};

export const updateGroup = (res) => {
    return {
        type: actionTypes.UPDATE_GROUP,
        result: res,
    };
};

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

export const selectGroup = (res) => {
    return {
        type: actionTypes.SELECT_GROUP,
        result: res,
    };
};

export const clearGroup = () => ({
    type: actionTypes.CLEAR_GROUP,
});

// saga new

export const startFetchDisabledGroups = () => ({
    type: actionTypes.FETCH_DISABLED_GROUPS,
});

export const startFetchEnabledGroups = () => ({
    type: actionTypes.FETCH_ENABLED_GROUPS,
});

export const startDeleteGroup = (id) => ({
    type: actionTypes.ASYNC_DELETE_GROUP,
    id,
});

export const startCreateGroup = (data) => ({
    type: actionTypes.ASYNC_CREATE_GROUP,
    data,
});

export const startUpdateGroup = (data) => ({
    type: actionTypes.ASYNC_UPDATE_GROUP,
    data,
});

export const startClearGroup = (data) => ({
    type: actionTypes.ASYNC_CLEAR_GROUP,
    data,
});

export const startToggleGroup = (enabledGroup, disabledGroup) => ({
    type: actionTypes.ASYNC_TOGGLE_DISABLED_GROUP,
    disabledGroup,
    enabledGroup,
});
