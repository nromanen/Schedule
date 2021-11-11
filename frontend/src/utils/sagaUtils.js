import i18n from '../i18n';

export const createErrorMessage = ({ response }) => {
    return response ? i18n.t(response.data.message, response.data.message) : 'Error';
};

export const createMessage = (message, cardTypeMessage, actionTypeMessage) => {
    return i18n.t(message, {
        cardType: i18n.t(cardTypeMessage),
        actionType: i18n.t(actionTypeMessage),
    });
};
