export const setDisabledItem = (item) => {
    const toggleItem = item;
    toggleItem.disable = true;
    return toggleItem;
};

export const setEnabledItem = (item) => {
    const toggleItem = item;
    toggleItem.disable = false;
    return toggleItem;
};
