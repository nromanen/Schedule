import React from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import './modal.scss';

import i18n from 'i18next';
import { disabledCard } from '../../../constants/disabledCard';
import './linkToMeetingDialog.scss';
import { COMMON_NO_BUTTON_TITLE } from '../../../constants/translationLabels';

export const LinkToMeetingDialog = (props) => {
    const { onClose, cardId, isHide, open, linkToMeeting } = props;

    const handleClose = () => {
        onClose(cardId);
    };

    return (
        <Dialog
            id="my-dialog"
            disableBackdropClick
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="confirm-dialog-title" className="confirm-dialog">
                <>
                    {isHide ? (
                        <>
                            {isHide === disabledCard.HIDE ? (
                                <>{i18n.t('common:do_you_wanna_disable')}</>
                            ) : (
                                <>{i18n.t('common:do_you_wanna_show')}</>
                            )}
                        </>
                    ) : (
                        <>
                            {i18n.t('common:do_you_wanna')}{' '}
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
                            </span>{' '}
                        </>
                    )}

                    {i18n.t('common:by_this_card_type', {
                        cardType: i18n.t(`formElements:reference_element`),
                    })}
                </>
            </DialogTitle>
            <div className="buttons-container">
                <Button
                    className="dialog-button"
                    variant="contained"
                    color="primary"
                    onClick={() => onClose(cardId)}
                >
                    {i18n.t('common:yes_button_title')}
                </Button>
                <Button className="dialog-button" variant="contained" onClick={() => onClose('')}>
                    {i18n.t(COMMON_NO_BUTTON_TITLE)}
                </Button>
            </div>
        </Dialog>
    );
};

LinkToMeetingDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default LinkToMeetingDialog;
