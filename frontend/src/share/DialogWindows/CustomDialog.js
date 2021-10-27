import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { DialogContent, Dialog, DialogTitle, DialogActions } from '@material-ui/core';

import './dialog.scss';
import dialogMapper from './dialogMapper';

const CustomDialog = (props) => {
    const {
        className,
        onClose,
        open,
        children,
        handelConfirm,
        whatDelete,
        warning,
        setOpenConfirmDialog,
        title,
        buttons = [],
        ...other
    } = dialogMapper(props);
    return ReactDOM.createPortal(
        <Dialog
            className={`custom-dialog ${className}`}
            onClose={() => onClose('')}
            open={open}
            {...other}
        >
            <DialogTitle className="custom-dialog-title">{title}</DialogTitle>
            <DialogContent className="custom-dialog-body">{children}</DialogContent>
            <DialogActions className="buttons-container">
                {buttons.map(({ label, handleClick, additionClassName = '', ...res }) => (
                    <Button
                        key={label}
                        variant="contained"
                        className={`dialog-button common-button ${additionClassName}`}
                        onClick={handleClick}
                        {...res}
                    >
                        {label}
                    </Button>
                ))}
            </DialogActions>
        </Dialog>,
        document.getElementById('modal-portal'),
    );
};

Dialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.string]),
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    buttons: PropTypes.arrayOf(PropTypes.object),
};

export default CustomDialog;
