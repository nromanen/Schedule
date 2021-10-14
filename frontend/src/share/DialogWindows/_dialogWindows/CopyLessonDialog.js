import React, { useState } from 'react';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import CustomDialog from '../CustomDialog';

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
            setError(translation('copy_to_same_group_error'));
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
            title={translation('choose_group')}
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
                        {translation('formElements:choose_button_title')}
                    </Button>
                    <Button className="dialog-button" variant="contained" onClick={onClose}>
                        {translation('formElements:cancel_button_title')}
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
                        label={translation('common:choose_group')}
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
