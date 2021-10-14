import React from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import './dialog.scss';

import i18n from '../../i18n';
import { disabledCard } from '../../constants/disabledCard';

export const ConfirmDialog = (props) => {
    const { onClose, whatDelete, cardId, isHide, open } = props;

    const handleClose = () => {
        onClose(cardId);
    };
    const ifHideTitle =
        isHide === disabledCard.HIDE
            ? i18n.t('common:do_you_wanna_disable')
            : i18n.t('common:do_you_wanna_show');

    return (
        <Dialog
            disableBackdropClick
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="confirm-dialog-title">
                {isHide ? (
                    ifHideTitle
                ) : (
                    <>
                        {i18n.t('common:do_you_wanna')}{' '}
                        <span className="delete-word">{i18n.t('common:delete_word')}</span>{' '}
                    </>
                )}

                {i18n.t('common:this_card_type', {
                    cardType: i18n.t(`formElements:${whatDelete}_element`),
                })}
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
                    {i18n.t('common:no_button_title')}
                </Button>
            </div>
        </Dialog>
    );
};

ConfirmDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default ConfirmDialog;
