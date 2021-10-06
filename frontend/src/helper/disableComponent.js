export const setDisableButton = (pristine, submitting, id) => {
    if (id !== undefined) {
        return false;
    }
    if (!pristine) {
        return false;
    }
    if (submitting) {
        return true;
    }
    if (id === undefined) {
        return true;
    }
};
export const getClearOrCancelTitle = (id, t) => {
    return id === undefined ? t('clear_button_label') : t('cancel_button_title');
};
