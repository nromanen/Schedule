import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import renderTextField from '../../../share/renderedFields/input';
import SelectField from '../../../share/renderedFields/select';
import { ROOM_FORM } from '../../../constants/reduxForms';
import { required, uniqueRoomName } from '../../../validation/validateFields';
import Card from '../../../share/Card/Card';
import './RoomForm.scss';
import { getClearOrCancelTitle, setDisableButton } from '../../../helper/disableComponent';
import {
    CREATE_TITLE,
    EDIT_TITLE, FORM_ROOM_LABEL_AFTER,
    NUMBER_LABEL,
    ROOM_LABEL,
    ROOM_Y_LABEL,
    SAVE_BUTTON_LABEL,
} from '../../../constants/translationLabels/formElements';
import { TYPE_LABEL } from '../../../constants/translationLabels/common';
import { renderAutocompleteField } from '../../../helper/renderAutocompleteField';


const RoomForm = (props) => {
    const { t } = useTranslation('formElements');
    const {
        handleSubmit,
        pristine,
        submitting,
        reset,
        oneRoom,
        roomTypes,
        rooms,
        initialize,
        clearRoomItem,
    } = props;

    const removeCurrentRoom = () => rooms.filter((el) => el.id !== oneRoom.id);
    const roomsForAutocomplete = oneRoom.id ? removeCurrentRoom() : rooms;

    useEffect(() => {
        if (oneRoom.id) {
            const { name, type, id } = oneRoom;
            const roomIndex = rooms.findIndex((room) => room.id === id);
            const afterId = rooms.find((item, index) => index === roomIndex - 1);
            initialize({
                id,
                name,
                type: type.id,
                afterId,
            });
        } else {
            initialize();
        }
    }, [oneRoom, rooms, initialize]);

    return (
        <Card additionClassName="form-card room-form">
            <form onSubmit={handleSubmit}>
                <h2 className="form-title">
                    {oneRoom.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} {t(ROOM_Y_LABEL)}
                </h2>
                <Field
                    type="text"
                    name="name"
                    component={renderTextField}
                    placeholder={t(NUMBER_LABEL)}
                    className="form-field"
                    label={t(ROOM_LABEL)}
                    validate={[required, uniqueRoomName]}
                />
                <Field
                    className="form-field"
                    component={SelectField}
                    name="type"
                    label={t(TYPE_LABEL)}
                    validate={[required]}
                >
                    <MenuItem value="" className="hidden" disabled />
                    {roomTypes.map((roomType) => (
                        <MenuItem key={roomType.id} value={roomType.id}>
                            {roomType.description}
                        </MenuItem>
                    ))}
                </Field>
                <Field
                    className="form-field"
                    name="afterId"
                    component={renderAutocompleteField}
                    label={t(FORM_ROOM_LABEL_AFTER)}
                    type="text"
                    values={roomsForAutocomplete}
                    getOptionLabel={(item) => (item ? item.name : '')}
                />
                <div className="form-buttons-container">
                    <Button
                        className="buttons-style"
                        variant="contained"
                        color="primary"
                        disabled={pristine || submitting}
                        type="submit"
                    >
                        {t(SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
                        className="buttons-style"
                        variant="contained"
                        disabled={setDisableButton(pristine, submitting, oneRoom.id)}
                        onClick={() => {
                            clearRoomItem();
                            reset(ROOM_FORM);
                        }}
                    >
                        {getClearOrCancelTitle(oneRoom.id, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default reduxForm({
    form: ROOM_FORM,
})(RoomForm);