import React, { useState } from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import {
    COMMON_NO_BUTTON_TITLE,
    COMMON_SCHEDULE_DIALOG_TITLE,
    COMMON_ROOM_IS_UNAVAILABLE,
    COMMON_AVAILABLE,
    COMMON_UNAVAILABLE,
    COMMON_TEACHER_IS_UNAVAILABLE,
    COMMON_CLASS_DOES_NOT_SUIT_FOR_TEACHER,
    COMMON_YES_BUTTON_TITLE,
    COMMON_ARE_YOU_SURE,
} from '../../constants/translationLabels/common';
import {
    FORM_CHOOSE_BUTTON_TITLE,
    FORM_CANCEL_BUTTON_TITLE,
    FORM_ROOM_LABEL,
} from '../../constants/translationLabels/formElements';
import './ScheduleDialog.scss';
import { CustomDialog } from '../../share/DialogWindows';
import '../../share/DialogWindows/dialog.scss';

const groupByAvailability = (arr) => {
    arr.sort((x, y) => {
        if (x === y) {
            return 0;
        }
        if (x) {
            return 1;
        }
        return -1;
    });
    return arr;
};

const ScheduleDialog = (props) => {
    const { onClose, itemData, open, rooms, availability, translation, isLoading } = props;

    const [room, setRoom] = useState('');
    const [sure, setSure] = useState(true);

    const getOptionLabel = (option) => {
        if (option && option.available) {
            return `${option.name} (${translation(COMMON_AVAILABLE)})`;
        }
        if (option) return `${option.name} (${translation(COMMON_UNAVAILABLE)})`;
        return '';
    };

    const chooseClickHandle = () => {
        if (!room) return;

        if (
            !room.available ||
            !availability.teacherAvailable ||
            !availability.classSuitsToTeacher
        ) {
            setSure(false);
            return;
        }
        onClose({ itemData, room });
        setRoom(null);
    };

    const defaultProps = {
        options: availability.rooms ? groupByAvailability(availability.rooms) : rooms,
        getOptionLabel,
    };

    if (sure && isLoading)
        return (
            <div className="circular-progress-dialog">
                <CircularProgress />
            </div>
        );

    return (
        <CustomDialog
            title={translation(COMMON_SCHEDULE_DIALOG_TITLE)}
            open={open}
            onClose={onClose}
        >
            {sure ? (
                <>
                    {isLoading ? (
                        <div className="circular-progress-dialog">
                            <CircularProgress />
                        </div>
                    ) : (
                        <>
                            <DialogTitle id="simple-dialog-title">
                                {translation(COMMON_SCHEDULE_DIALOG_TITLE)}
                            </DialogTitle>
                            <div className="availability-info">
                                {!availability.classSuitsToTeacher ? (
                                    <p className="availability-warning">
                                        {translation(COMMON_CLASS_DOES_NOT_SUIT_FOR_TEACHER)}
                                    </p>
                                ) : (
                                    ''
                                )}
                                {!availability.teacherAvailable ? (
                                    <p className="availability-warning">
                                        {translation(COMMON_TEACHER_IS_UNAVAILABLE)}{' '}
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>
                            <Autocomplete
                                {...defaultProps}
                                id="group"
                                clearOnEscape
                                openOnFocus
                                className="room-field"
                                onChange={(event, newValue) => {
                                    setRoom(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={translation(FORM_ROOM_LABEL)}
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
                                <Button
                                    className="dialog-button"
                                    variant="contained"
                                    onClick={() => onClose()}
                                >
                                    {translation(FORM_CANCEL_BUTTON_TITLE)}
                                </Button>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <DialogTitle id="simple-dialog-title">
                        <p className="availability-warning">
                            {!room.available ? `${translation(COMMON_ROOM_IS_UNAVAILABLE)}. ` : ''}
                        </p>
                        <p className="availability-warning">
                            {!availability.teacherAvailable
                                ? `${translation(COMMON_TEACHER_IS_UNAVAILABLE)}. `
                                : ''}
                        </p>

                        <p className="availability-warning">
                            {!availability.classSuitsToTeacher
                                ? `${translation(COMMON_CLASS_DOES_NOT_SUIT_FOR_TEACHER)}. `
                                : ''}
                        </p>

                        {translation(COMMON_ARE_YOU_SURE)}
                    </DialogTitle>
                    <div className="buttons-container">
                        <Button
                            className="dialog-button"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                onClose({ itemData, room });
                                setSure(true);
                            }}
                        >
                            {translation(COMMON_YES_BUTTON_TITLE)}
                        </Button>
                        <Button
                            className="dialog-button"
                            variant="contained"
                            onClick={() => setSure(true)}
                        >
                            {translation(COMMON_NO_BUTTON_TITLE)}
                        </Button>
                    </div>
                </>
            )}
        </CustomDialog>
    );
};

ScheduleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    rooms: PropTypes.array.isRequired,
    availability: PropTypes.object.isRequired,
};

export default ScheduleDialog;
