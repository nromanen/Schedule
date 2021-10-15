import React from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import i18n from '../../i18n';
import { disabledCard } from '../../constants/disabledCard';
import {
    COMMON_NO_BUTTON_TITLE,
    COMMON_YES_BUTTON_TITLE,
    COMMON_DO_YOU_WANNA_DISABLE,
    COMMON_DO_YOU_WANNA_SHOW,
    COMMON_DO_YOU_WANNA,
    COMMON_DELETE_WORD,
    COMMON_THIS_CARD_TYPE,
} from '../../constants/translationLabels/common';

const ConfirmDialog = (props) => {
    const { onClose, whatDelete, cardId, isHide, open } = props;

    const handleClose = () => {
        onClose(cardId);
    };

    return (
        <Dialog
            disableBackdropClick
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="confirm-dialog-title">
                <>
                    {isHide ? (
                        <>
                            {isHide === disabledCard.HIDE ? (
                                <>{i18n.t(COMMON_DO_YOU_WANNA_DISABLE)}</>
                            ) : (
                                <>{i18n.t(COMMON_DO_YOU_WANNA_SHOW)}</>
                            )}
                        </>
                    ) : (
                        <>
                            {i18n.t(COMMON_DO_YOU_WANNA)}{' '}
                            <span className="delete-word">{i18n.t(COMMON_DELETE_WORD)}</span>{' '}
                        </>
                    )}

                    {i18n.t(COMMON_THIS_CARD_TYPE, {
                        cardType: i18n.t(`formElements:${whatDelete}_element`),
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
                    {i18n.t(COMMON_YES_BUTTON_TITLE)}
                </Button>
                <Button className="dialog-button" variant="contained" onClick={() => onClose('')}>
                    {i18n.t(COMMON_NO_BUTTON_TITLE)}
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
