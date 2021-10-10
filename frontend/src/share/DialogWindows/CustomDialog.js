import React from 'react';

import PropTypes from 'prop-types';

import { DialogContent, Dialog, DialogTitle, DialogActions } from '@material-ui/core';

import './dialog.scss';

const CustomDialog = (props) => {
    const { onClose, buttons, open, title, children, ...other } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog
            {...other}
            disableBackdropClick
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions className="buttons-container">{buttons}</DialogActions>
        </Dialog>
    );
};

Dialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.string]).isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    buttons: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default CustomDialog;
