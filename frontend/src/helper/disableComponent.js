import { isNil } from 'lodash';
import {
    CLEAR_BUTTON_LABEL,
    CANCEL_BUTTON_TITLE,
} from '../constants/translationLabels/formElements';

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
    return id === undefined ? t(CLEAR_BUTTON_LABEL) : t(CANCEL_BUTTON_TITLE);
};
