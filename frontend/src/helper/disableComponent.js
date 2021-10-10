import { isNil } from 'lodash';

export const setDisableButton = (pristine, submitting, id) => {
    if (!pristine || !isNil(id)) {
        return false;
    }
    if (submitting || isNil(id)) {
        return true;
    }
    return false;
};
export const getClearOrCancelTitle = (id, t) => {
    return id === undefined ? t('clear_button_label') : t('cancel_button_title');
};
