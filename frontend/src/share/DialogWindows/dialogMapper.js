import React from 'react';
import Button from '@material-ui/core/Button';
import { isEmpty } from 'lodash';
import i18n from '../../helper/i18n';
import { dialogTypes } from '../../constants/dialogs';

export const dialogMapper = (props) => {
    const { onClose, cardId, type, whatDelete, linkToMeeting = 'none' } = props;
    const defaultModalButtons = (
        <>
            <Button
                className="dialog-button"
                variant="contained"
                color="primary"
                onClick={() => onClose(cardId)}
            >
                {i18n.t('common:yes_button_title')}
            </Button>
            <Button className="dialog-button" variant="contained" onClick={() => onClose('')}>
                {i18n.t('common:no_button_title')}
            </Button>
        </>
    );
    const dialogPresets = {
        [dialogTypes.DELETE_CONFIRM]: {
            title: (
                <>
                    {i18n.t('common:do_you_wanna')}{' '}
                    <span className="delete-word">{i18n.t('common:delete_word')}</span>{' '}
                    {i18n.t('common:this_card_type', {
                        cardType: i18n.t(`formElements:${whatDelete}_element`),
                    })}
                </>
            ),
            buttons: defaultModalButtons,
            ...props,
        },
        [dialogTypes.SET_VISIBILITY_DISABLED]: {
            title: i18n.t('common:do_you_wanna_disable'),
            buttons: defaultModalButtons,
            ...props,
        },
        [dialogTypes.SET_VISIBILITY_ENABLED]: {
            title: i18n.t('common:do_you_wanna_show'),
            buttons: defaultModalButtons,
            ...props,
        },
        [dialogTypes.MEETING_LINK]: {
            title: (
                <>
                    {i18n.t('common:do_you_wanna_show')}{' '}
                    {i18n.t('common:by_this_card_type', {
                        cardType: i18n.t(`formElements:reference_element`),
                    })}
                </>
            ),
            children: (
                <>
                    {i18n.t('common:do_you_wanna')}
                    <span>
                        <a
                            className="go-to-meeting"
                            href={linkToMeeting}
                            target="_blank"
                            title={linkToMeeting}
                            rel="noreferrer"
                        >
                            {i18n.t(`common:go_to_meeting_word`)}
                        </a>
                    </span>
                </>
            ),
            buttons: defaultModalButtons,
            ...props,
        },
        [dialogTypes.SET_DEFAULT]: {
            title: (
                <>
                    {i18n.t('common:do_you_wanna')}{' '}
                    <span className="set-default">{i18n.t(`common:set_default_word`)}</span>{' '}
                    {i18n.t('common:this_card_type', {
                        cardType: i18n.t(`formElements:semester_element`),
                    })}
                </>
            ),
            buttons: defaultModalButtons,
            ...props,
        },
    };
    return isEmpty(dialogPresets[type]) ? props : dialogPresets[type];
};
