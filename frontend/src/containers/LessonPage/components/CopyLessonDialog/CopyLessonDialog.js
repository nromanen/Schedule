import React, { useState } from 'react';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {
    FORM_CHOOSE_BUTTON_TITLE,
    FORM_CANCEL_BUTTON_TITLE,
} from '../../../../constants/translationLabels/formElements';
import {
    COPY_TO_SAME_GROUP_ERROR,
    CHOOSE_GROUP,
    COMMON_CHOOSE_GROUP,
} from '../../../../constants/translationLabels/common';
import CustomDialog from '../../../../share/DialogWindows/CustomDialog';

const useStyles = makeStyles(() => ({
    groupField: {
        '&': {
            margin: '0 auto',
            width: '90%',
        },
    },
}));

const CopyLessonDialog = (props) => {
    const { onClose, lesson, translation, groups, groupId, open } = props;
    const [group, setGroup] = useState('');
    const [error, setError] = useState('');

    const classes = useStyles();

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

    const handleChangeAutocomplete = (event, newValue) => {
        setGroup(newValue);
        setError(null);
    };

    const defaultProps = {
        options: groups,
        getOptionLabel: (option) => (option ? option.title : ''),
    };
    return (
        <CustomDialog
            title={translation(CHOOSE_GROUP)}
            open={open}
            onClose={onClose}
            buttons={
                <>
                    <Button
                        className="dialog-button"
                        variant="contained"
                        color="primary"
                        onClick={chooseClickHandle}
                    >
                        {translation(FORM_CHOOSE_BUTTON_TITLE)}
                    </Button>
                    <Button className="dialog-button" variant="contained" onClick={onClose}>
                        {translation(FORM_CANCEL_BUTTON_TITLE)}
                    </Button>
                </>
            }
        >
            <Autocomplete
                {...defaultProps}
                id="group"
                multiple
                clearOnEscape
                openOnFocus
                className={classes.groupField}
                onChange={handleChangeAutocomplete}
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
        </CustomDialog>
    );
};
CopyLessonDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    lesson: PropTypes.object.isRequired,
    translation: PropTypes.func.isRequired,
    groupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default CopyLessonDialog;
