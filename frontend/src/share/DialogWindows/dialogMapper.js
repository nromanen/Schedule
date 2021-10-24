import React from 'react';
import Button from '@material-ui/core/Button';
import i18n from '../../i18n';
import { dialogTypes } from '../../constants/dialogs';
import {
    COMMON_YES_BUTTON_TITLE,
    COMMON_NO_BUTTON_TITLE,
    COMMON_DO_YOU_WANNA,
    COMMON_DO_YOU_WANNA_DISABLE,
    COMMON_DELETE_WORD,
    COMMON_DO_YOU_WANNA_SHOW,
    COMMON_BY_THIS_CARD_TYPE,
    COMMON_THIS_CARD_TYPE,
    COMMON_GO_TO_MEETING_WORD,
    COMMON_SET_DEFAULT_WORD,
} from '../../constants/translationLabels/common';
import {
    FORM_REFERENCE_ELEMENT,
    FORM_SEMESTER_ELEMENT,
} from '../../constants/translationLabels/formElements';

export const dialogMapper = (props) => {
    const { onClose, cardId, type, whatDelete, linkToMeeting = 'none', setOpenSubDialog } = props;
    const defaultModalButtons = (
        <>
            <Button
                className="dialog-button"
                variant="contained"
                color="primary"
                onClick={() => onClose(cardId)}
            >
                {i18n.t(COMMON_YES_BUTTON_TITLE)}
            </Button>
            <Button
                className="dialog-button"
                variant="contained"
                onClick={() => setOpenSubDialog(false)}
            >
                {i18n.t(COMMON_NO_BUTTON_TITLE)}
            </Button>
        </>
    );
    switch (type) {
        case dialogTypes.DELETE_CONFIRM:
            return {
                title: (
                    <>
                        {i18n.t(COMMON_DO_YOU_WANNA)}{' '}
                        <span className="delete-word">{i18n.t(COMMON_DELETE_WORD)}</span>{' '}
                        {i18n.t(COMMON_THIS_CARD_TYPE, {
                            cardType: i18n.t(`formElements:${whatDelete}_element`),
                        })}
                    </>
                ),
                buttons: defaultModalButtons,
                ...props,
            };
        case dialogTypes.SET_VISIBILITY_DISABLED:
            return {
                title: i18n.t(COMMON_DO_YOU_WANNA_DISABLE),
                buttons: defaultModalButtons,
                ...props,
            };
        case dialogTypes.SET_VISIBILITY_ENABLED:
            return {
                title: i18n.t(COMMON_DO_YOU_WANNA_SHOW),
                buttons: defaultModalButtons,
                ...props,
            };
        case dialogTypes.MEETING_LINK:
            return {
                title: (
                    <>
                        {i18n.t(COMMON_DO_YOU_WANNA_SHOW)}{' '}
                        {i18n.t(COMMON_BY_THIS_CARD_TYPE, {
                            cardType: i18n.t(FORM_REFERENCE_ELEMENT),
                        })}
                    </>
                ),
                children: (
                    <>
                        {i18n.t(COMMON_DO_YOU_WANNA)}
                        <span>
                            <a
                                className="go-to-meeting"
                                href={linkToMeeting}
                                target="_blank"
                                title={linkToMeeting}
                                rel="noreferrer"
                            >
                                {i18n.t(COMMON_GO_TO_MEETING_WORD)}
                            </a>
                        </span>
                    </>
                ),
                buttons: defaultModalButtons,
                ...props,
            };
        case dialogTypes.SET_DEFAULT:
            return {
                title: (
                    <>
                        {i18n.t(COMMON_DO_YOU_WANNA)}{' '}
                        <span className="set-default">{i18n.t(COMMON_SET_DEFAULT_WORD)}</span>{' '}
                        {i18n.t(COMMON_THIS_CARD_TYPE, {
                            cardType: i18n.t(FORM_SEMESTER_ELEMENT),
                        })}
                    </>
                ),
                buttons: defaultModalButtons,
                ...props,
            };
        default:
            return props;
    }
};
