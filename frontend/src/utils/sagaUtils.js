import i18n from '../i18n';
import { FORM_STUDENT_LABEL, FORM_GROUP_LABEL } from '../constants/translationLabels/formElements';
import { BACK_END_SUCCESS_OPERATION } from '../constants/translationLabels/serviceMessages';

export const createErrorMessage = ({ response }) => {
    return response ? i18n.t(response.data.message, response.data.message) : 'Error';
};

export const createMessage = (message, cardTypeMessage, actionTypeMessage) => {
    return i18n.t(message, {
        cardType: i18n.t(cardTypeMessage),
        actionType: i18n.t(actionTypeMessage),
    });
};

export const createDynamicMessage = (typeMessage, message) => {
    switch (typeMessage) {
        case 'group':
            return i18n.t(BACK_END_SUCCESS_OPERATION, {
                cardType: i18n.t(FORM_GROUP_LABEL),
                actionType: i18n.t(message),
            });
        case 'student':
            return i18n.t(BACK_END_SUCCESS_OPERATION, {
                cardType: i18n.t(FORM_STUDENT_LABEL),
                actionType: i18n.t(message),
            });
        default:
            return 'SUCCESS';
    }
};
