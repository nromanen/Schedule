import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import renderTextField from '../../../share/renderedFields/input';
import SelectField from '../../../share/renderedFields/select';
import { ROOM_FORM } from '../../../constants/reduxForms';
import { required, uniqueRoomName } from '../../../validation/validateFields';
import Card from '../../../share/Card/Card';
import './RoomForm.scss';
import { getClearOrCancelTitle, setDisableButton } from '../../../helper/disableComponent';
import {
    EDIT_TITLE,
    CREATE_TITLE,
    SAVE_BUTTON_LABEL,
    ROOM_Y_LABEL,
    NUMBER_LABEL,
    ROOM_LABEL,
} from '../../../constants/translationLabels/formElements';
import { TYPE_LABEL } from '../../../constants/translationLabels/common';

const AddRoomForm = (props) => {
    const { t } = useTranslation('formElements');
    const {
        handleSubmit,
        pristine,
        submitting,
        reset,
        oneRoom,
        roomTypes,
        initialize,
        clearRoomItem,
    } = props;

    useEffect(() => {
        if (oneRoom.id) {
            const { name, type, id } = oneRoom;
            initialize({
                id,
                name,
                type: type.id,
            });
        } else {
            initialize();
        }
    }, [oneRoom]);

    return (
        <Card additionClassName="form-card room-form">
            <form className="createGroupForm w-100" onSubmit={handleSubmit}>
                <h2 className="form-title">
                    {oneRoom.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} {t(ROOM_Y_LABEL)}
                </h2>
                <Field
                    type="text"
                    name="name"
                    component={renderTextField}
                    placeholder={t(NUMBER_LABEL)}
                    className="form-field room-form-field"
                    label={t(ROOM_LABEL)}
                    validate={[required, uniqueRoomName]}
                />
                <Field
                    className="form-field room-form-field"
                    component={SelectField}
                    name="type"
                    label={t(TYPE_LABEL)}
                    validate={[required]}
                >
                    <option className="room-select-item" />
                    {roomTypes.map((roomType) => (
                        <option key={roomType.id} value={roomType.id} className="room-select-item">
                            {roomType.description}
                        </option>
                    ))}
                </Field>
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
})(AddRoomForm);
