import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { dialogTypes, dialogCloseButton, dialogChooseButton } from '../../constants/dialogs';
import {
    COMMON_SCHEDULE_DIALOG_TITLE,
    COMMON_ROOM_IS_UNAVAILABLE,
    COMMON_AVAILABLE,
    COMMON_UNAVAILABLE,
    COMMON_TEACHER_IS_UNAVAILABLE,
} from '../../constants/translationLabels/common';
import { FORM_ROOM_LABEL } from '../../constants/translationLabels/formElements';
import './ScheduleDialog.scss';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { sortByAvailability } from '../../helper/sortArray';
import '../../share/DialogWindows/dialog.scss';

const ScheduleDialog = (props) => {
    const {
        onClose,
        setOpenConfirmDialog,
        handleChangeSchedule,
        itemData,
        open,
        rooms,
        availability,
        isOpenConfirmDialog,
    } = props;

    const [room, setRoom] = useState('');
    const [warning, setWarning] = useState('');

    const getOptionLabel = (option) => {
        return `${option.name} (${
            option.available ? i18n.t(COMMON_AVAILABLE) : i18n.t(COMMON_UNAVAILABLE)
        })`;
    };

    useEffect(() => {
        if (availability.teacherAvailable) {
            setWarning(i18n.t(COMMON_TEACHER_IS_UNAVAILABLE));
        }
    }, []);

    const chooseClickHandle = () => {
        if (!room) return;
        setOpenConfirmDialog(true);
        if (!room.available) {
            setWarning((prev) => `${prev}\n${i18n.t(COMMON_ROOM_IS_UNAVAILABLE)}`);
        }
    };
    const defaultProps = {
        options: availability.rooms ? sortByAvailability(availability.rooms) : rooms,
        getOptionLabel,
    };

    return (
        <>
            <CustomDialog
                title={i18n.t(COMMON_SCHEDULE_DIALOG_TITLE)}
                open={open}
                onClose={onClose}
                buttons={[dialogChooseButton(chooseClickHandle), dialogCloseButton(onClose)]}
            >
                <div className="availability-info">
                    <p className="availability-warning">{warning}</p>
                </div>
                <div className="autocomplete-container">
                    <Autocomplete
                        {...defaultProps}
                        id="group"
                        clearOnEscape
                        openOnFocus
                        className="form-input"
                        onChange={(_, newValue) => {
                            setRoom(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={i18n.t(FORM_ROOM_LABEL)}
                                margin="normal"
                            />
                        )}
                    />
                </div>
            </CustomDialog>

            <CustomDialog
                type={dialogTypes.CONFIRM_WITH_WARNING}
                open={isOpenConfirmDialog}
                warning={warning}
                handelConfirm={() => {
                    handleChangeSchedule(room.id, itemData);
                    setOpenConfirmDialog(false);
                }}
            />
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
