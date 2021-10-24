import React from 'react';

import PropTypes from 'prop-types';

import { DialogContent, Dialog, DialogTitle, DialogActions } from '@material-ui/core';

import './dialog.scss';
import { dialogMapper } from './dialogMapper';

const CustomDialog = (props) => {
    const { onClose, buttons, open, title, children, setOpenSubDialog } = dialogMapper(props);
    return (
        <Dialog className="custom-dialog" disableBackdropClick onClose={onClose} open={open}>
            <DialogTitle className="custom-dialog-title">{title}</DialogTitle>
            <DialogContent className="custom-dialog-body">{children}</DialogContent>
            <DialogActions className="buttons-container">{buttons}</DialogActions>
        </Dialog>
    );
};

Dialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.string]).isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    buttons: PropTypes.node.isRequired,
};

export default CustomDialog;
