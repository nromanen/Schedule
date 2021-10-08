export const setDisableButton = (pristine, submitting, id) => {
    if (submitting || id === undefined) {
        return true;
    }
    return false;
};
export const getClearOrCancelTitle = (id, t) => {
    return id === undefined ? t('clear_button_label') : t('cancel_button_title');
};
