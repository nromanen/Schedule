import React, { useState } from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {
    FORM_CHOOSE_BUTTON_TITLE,
    FORM_CANCEL_BUTTON_TITLE,
} from '../../../constants/translationLabels';
import {
    COPY_TO_SAME_GROUP_ERROR,
    CHOOSE_GROUP,
    COMMON_CHOOSE_GROUP,
} from '../../../constants/translationLabels/common';

const useStyles = makeStyles(() => ({
    groupField: {
        '&': {
            margin: '0 auto',
            width: '90%',
        },
    },
}));

export const CopyLessonDialog = (props) => {
    const { onClose, lesson, translation, groups, groupId, open } = props;
    const [group, setGroup] = useState('');
    const [error, setError] = useState('');

    const classes = useStyles();

    const handleClose = () => {
        onClose();
    };

    const chooseClickHandle = () => {
        if (!group) {
            return;
        }
        if (group.id === groupId) {
            setError(translation(COPY_TO_SAME_GROUP_ERROR));
            return;
        }
        onClose({ lesson, group });
    };

    const defaultProps = {
        options: groups,
        getOptionLabel: (option) => (option ? option.title : ''),
    };

    return (
        <Dialog
            disableBackdropClick
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="simple-dialog-title">{translation(CHOOSE_GROUP)}</DialogTitle>
            <Autocomplete
                {...defaultProps}
                id="group"
                multiple
                clearOnEscape
                openOnFocus
                className={classes.groupField}
                onChange={(event, newValue) => {
                    setGroup(newValue);
                    setError(null);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={translation(COMMON_CHOOSE_GROUP)}
                        error={!!error}
                        helperText={error || null}
                        margin="normal"
                    />
                )}
            />
            <div className="buttons-container">
                <Button
                    className="dialog-button"
                    variant="contained"
                    color="primary"
                    onClick={() => chooseClickHandle()}
                >
                    {translation(FORM_CHOOSE_BUTTON_TITLE)}
                </Button>
                <Button className="dialog-button" variant="contained" onClick={() => onClose()}>
                    {translation(FORM_CANCEL_BUTTON_TITLE)}
                </Button>
            </div>
        </Dialog>
    );
};

CopyLessonDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default CopyLessonDialog;
