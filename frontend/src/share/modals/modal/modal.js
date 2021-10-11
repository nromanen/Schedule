import React from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import './modal.scss';

export const ModalWindow = (props) => {
    const { onClose, cardId, open, windowTitle } = props;

    const handleClose = () => {
        onClose(cardId);
    };

    const renderOkButton = () => {
        if (!props.isOkButton) {
            return null;
        }
        return (
            <Button className="dialog-button" variant="contained" color="primary">
                {props.okButtonLabel}
            </Button>
        );
    };
    const renderNoButton = () => {
        if (!props.isNoButton) {
            return null;
        }
        return (
            <Button className="dialog-button" variant="contained" onClick={() => onClose('')}>
                {props.noButtonLabel}
            </Button>
        );
    };

    const renderModalButtons = () => {
        if (!props.isOkButton && !props.isNoButton) {
            return null;
        }
        return (
            <div className="buttons-container">
                {renderOkButton()}
                {renderNoButton()}
            </div>
        );
    };

    return (
        <Dialog
            disableBackdropClick
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="confirm-dialog-title">{windowTitle}</DialogTitle>
            {props.children}
            {renderModalButtons()}
        </Dialog>
    );
};

ModalWindow.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default ModalWindow;
