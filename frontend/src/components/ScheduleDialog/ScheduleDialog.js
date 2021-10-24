import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { isNil } from 'lodash';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
    COMMON_NO_BUTTON_TITLE,
    COMMON_SCHEDULE_DIALOG_TITLE,
    COMMON_ROOM_IS_UNAVAILABLE,
    COMMON_AVAILABLE,
    COMMON_UNAVAILABLE,
    COMMON_TEACHER_IS_UNAVAILABLE,
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
import { sortByAvailability } from '../../helper/sortArray';
import '../../share/DialogWindows/dialog.scss';

const ScheduleDialog = (props) => {
    const { onClose, itemData, open, rooms, availability, translation } = props;

    const [room, setRoom] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [warning, setWarning] = useState('');

    const getOptionLabel = (option) => {
        if (!isNil(option)){
            return `${option.name} (${ option.available ? translation(COMMON_AVAILABLE) : translation(COMMON_UNAVAILABLE)})`;          
        }
        return '';
    };

    useEffect(() => {
        if (availability.teacherAvailable) {
            setWarning(translation(COMMON_TEACHER_IS_UNAVAILABLE));
        }
    }, []);

    const chooseClickHandle = () => {
        if (!room) return;
        setOpenConfirmDialog(true);
        if (!room.available) {
            setWarning((prev) => prev + '\n' + translation(COMMON_ROOM_IS_UNAVAILABLE));
        }
    };
    const defaultProps = {
        options: availability.rooms ? sortByAvailability(availability.rooms) : rooms,
        getOptionLabel,
    };

    return (
        <>
            <CustomDialog
                title={translation(COMMON_SCHEDULE_DIALOG_TITLE)}
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
                <div className="availability-info">
                    <p className="availability-warning">{warning}</p>
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
            </CustomDialog>

            {openConfirmDialog && (
                <CustomDialog
                    title={translation(COMMON_ARE_YOU_SURE)}
                    open={openConfirmDialog}
                    onClose={onClose}
                    buttons={
                        <>
                            <Button
                                className="dialog-button"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    onClose({ itemData, room });
                                    setOpenConfirmDialog(false);
                                }}
                            >
                                {translation(COMMON_YES_BUTTON_TITLE)}
                            </Button>
                            <Button
                                className="dialog-button"
                                variant="contained"
                                onClick={() => setOpenConfirmDialog(false)}
                            >
                                {translation(COMMON_NO_BUTTON_TITLE)}
                            </Button>
                        </>
                    }
                >
                    <div className="availability-info">
                        <p className="availability-warning">{warning}</p>
                    </div>
                </CustomDialog>
            )}
        </>
    );
};

ScheduleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    rooms: PropTypes.array.isRequired,
    availability: PropTypes.object.isRequired,
};

export default ScheduleDialog;
