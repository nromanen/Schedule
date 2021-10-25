import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import { DialogContent, Dialog, DialogTitle, DialogActions } from '@material-ui/core';

import './dialog.scss';
import { dialogMapper } from './dialogMapper';

const CustomDialog = (props) => {
    const { onClose, buttons, open, title, children, ...other } = dialogMapper(props);
    return ReactDOM.createPortal(
        <Dialog className="custom-dialog" onClose={() => onClose('')} open={open} {...other}>
            <DialogTitle className="custom-dialog-title">{title}</DialogTitle>
            <DialogContent className="custom-dialog-body">{children}</DialogContent>
            <DialogActions className="buttons-container">{buttons}</DialogActions>
        </Dialog>,
        document.getElementById('modal-portal'),
    );
};

Dialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.string]),
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    buttons: PropTypes.node,
};

export default CustomDialog;
