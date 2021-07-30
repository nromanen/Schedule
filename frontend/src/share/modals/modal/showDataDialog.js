import React from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import '../dialog.scss';

import i18n from '../../../helper/i18n';
import { getTeacherFullName, getTeacherWithDepartmentAndEmail } from '../../../helper/renderTeacher';

export const ShowDataDialog = props => {
    const { onClose,  cardId, open,teachers } = props;

    const handleClose = () => {
        onClose(cardId);
    };

    return (
        <Dialog
            disableBackdropClick={true}
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="confirm-dialog-title">
                <>
                    {teachers.map(item=> {
                       return <div>{getTeacherWithDepartmentAndEmail(item)}</div> ;
                    })}
                </>
            </DialogTitle>
            <div className="buttons-container">
                <Button
                    className="dialog-button"
                    variant="contained"
                    onClick={() => onClose('')}
                >
                    {i18n.t('common:close_title')}
                </Button>
            </div>
        </Dialog>
    );
};

ShowDataDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export default ShowDataDialog;