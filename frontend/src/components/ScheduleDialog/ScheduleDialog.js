import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { dialogTypes } from '../../constants/dialogs';
import { setIsOpenConfirmDialogService } from '../../services/dialogService';
import {
    COMMON_SCHEDULE_DIALOG_TITLE,
    COMMON_ROOM_IS_UNAVAILABLE,
    COMMON_AVAILABLE,
    COMMON_UNAVAILABLE,
    COMMON_TEACHER_IS_UNAVAILABLE,
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
    const { onClose, itemData, open, rooms, availability, translation, isOpenConfirmDialog } =
        props;

    const [room, setRoom] = useState('');
    const [warning, setWarning] = useState('');

    const getOptionLabel = (option) => {
        return `${option.name} (${
            option.available ? translation(COMMON_AVAILABLE) : translation(COMMON_UNAVAILABLE)
        })`;
    };

    useEffect(() => {
        if (availability.teacherAvailable) {
            setWarning(translation(COMMON_TEACHER_IS_UNAVAILABLE));
        }
    }, []);

    const chooseClickHandle = () => {
        if (!room) return;
        setIsOpenConfirmDialogService(true);
        if (!room.available) {
            setWarning((prev) => `${prev}\n${translation(COMMON_ROOM_IS_UNAVAILABLE)}`);
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
                buttons={[
                    {
                        label: translation(FORM_CHOOSE_BUTTON_TITLE),
                        handleClick: chooseClickHandle,
                        color: 'primary',
                    },
                    {
                        label: translation(FORM_CANCEL_BUTTON_TITLE),
                        handleClick: () => onClose(''),
                    },
                ]}
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

            {isOpenConfirmDialog && (
                <CustomDialog
                    type={dialogTypes.CONFIRM_WITH_WARNING}
                    open={isOpenConfirmDialog}
                    warning={warning}
                    handelConfirm={() => {
                        onClose({ itemData, room });
                        setIsOpenConfirmDialogService(false);
                    }}
                />
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
