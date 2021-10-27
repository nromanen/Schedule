import i18n from 'i18next';
import {
    FORM_CANCEL_BUTTON_TITLE,
    FORM_CHOOSE_BUTTON_TITLE,
    FORM_CHOOSE_GROUP_LABEL,
} from './translationLabels/formElements';
import {
    COMMON_CLOSE_TITLE,
    CONFIRM_GROUPS,
    SENT_SCHEDULE,
    COMMON_UPLOAD_TITLE,
    COMMON_UPLOAD_FROM_FILE_TITLE,
    COMMON_YES_BUTTON_TITLE,
    COMMON_NO_BUTTON_TITLE,
    COMMON_MOVE_LABEL,
} from './translationLabels/common';

export const dialogTypes = {
    DELETE_CONFIRM: 'deleteConfirm',
    SET_VISIBILITY_ENABLED: 'setVisibilityEnabled',
    SET_VISIBILITY_DISABLED: 'setVisibilityDisabled',
    MEETING_LINK: 'meetingLink',
    SET_DEFAULT: 'setDefault',
    CONFIRM_WITH_WARNING: 'confirmWithWarning',
};

export const dialogCloseButton = (handelFuc, additionalParams) => {
    return {
        label: i18n.t(COMMON_CLOSE_TITLE),
        handleClick: handelFuc,
        color: 'primary',
        ...additionalParams,
    };
};

export const dialogChooseButton = (handelFuc) => {
    return {
        label: i18n.t(FORM_CHOOSE_BUTTON_TITLE),
        handleClick: handelFuc,
        color: 'primary',
    };
};

export const dialogChooseGroupButton = (handelFuc, isDisabled, additionalParams) => {
    return {
        label: i18n.t(FORM_CHOOSE_GROUP_LABEL),
        handleClick: handelFuc,
        color: 'primary',
        disabled: isDisabled,
        ...additionalParams,
    };
};

export const dialogConfirmButton = (handelFuc) => {
    return {
        label: i18n.t(CONFIRM_GROUPS),
        handleClick: handelFuc,
        color: 'primary',
    };
};

export const dialogCancelButton = (handelFuc) => {
    return {
        label: i18n.t(FORM_CANCEL_BUTTON_TITLE),
        handleClick: handelFuc,
        color: 'primary',
    };
};
export const dialogSendSchedule = (handelFuc, isDisabled) => {
    return {
        label: i18n.t(SENT_SCHEDULE),
        handleClick: handelFuc,
        color: 'primary',
        disabled: isDisabled,
    };
};
export const dialogUploadButton = (handelFuc, isDisabled) => {
    return {
        label: i18n.t(COMMON_UPLOAD_TITLE),
        handleClick: handelFuc,
        color: 'primary',
        disabled: isDisabled,
    };
};
export const dialogUploadFromFileButton = (handelFuc, additionalParams) => {
    return {
        label: i18n.t(COMMON_UPLOAD_FROM_FILE_TITLE),
        handleClick: handelFuc,
        color: 'primary',
        ...additionalParams,
    };
};

export const dialogMoveToGroupButton = (handelFuc) => {
    return {
        label: i18n.t(COMMON_MOVE_LABEL),
        handleClick: handelFuc,
        color: 'primary',
    };
};
export const dialogYesButton = (handelFuc) => {
    return {
        label: i18n.t(COMMON_YES_BUTTON_TITLE),
        handleClick: handelFuc,
        color: 'primary',
    };
};
export const dialogNoButton = (handelFuc) => {
    return {
        label: i18n.t(COMMON_NO_BUTTON_TITLE),
        handleClick: handelFuc,
        variant: 'contained',
    };
};
