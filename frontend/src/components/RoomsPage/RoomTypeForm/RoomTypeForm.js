import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { ROOM_FORM_TYPE } from '../../../constants/reduxForms';
import { cardType } from '../../../constants/cardType';
import { dialogTypes } from '../../../constants/dialogs';
import Card from '../../../share/Card/Card';
import renderTextField from '../../../share/renderedFields/input';
import './RoomTypeForm.scss';
import {
    SAVE_BUTTON_LABEL,
    ADD_TYPE_LABEL,
    NEW_TYPE_LABEL,
} from '../../../constants/translationLabels/formElements';

const RoomTypeForm = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        roomTypes,
        oneType,
        initialize,
        setSelectRoomType,
        showConfirmDialog,
    } = props;

    useEffect(() => {
        if (oneType.id) {
            const { description, id } = oneType;
            initialize({ description, id });
        } else {
            initialize({});
        }
    }, [oneType]);

    const { t } = useTranslation('formElements');

    return (
        <>
            <Card additionClassName="form-card room-form new-type">
                <form className="new-type-container" onSubmit={handleSubmit}>
                    <Field
                        type="text"
                        name="description"
                        component={renderTextField}
                        placeholder={t(ADD_TYPE_LABEL)}
                        label={t(NEW_TYPE_LABEL)}
                        className="form-field"
                        variant="outlined"
                    />
                    <div className="btn-style-wrapper">
                        <Button
                            color="primary"
                            className="btn-style"
                            disabled={pristine || submitting}
                            variant="contained"
                            type="submit"
                        >
                            {t(SAVE_BUTTON_LABEL)}
                        </Button>
                    </div>
                </form>

                <ul className="new-types">
                    {roomTypes.map((roomType) => (
                        <li
                            key={roomType.id}
                            value={roomType.description}
                            className="new-types-list"
                        >
                            <span className="type-description">{roomType.description}</span>
                            <span className="buttons">
                                <FaEdit
                                    className="btn edit"
                                    onClick={() => setSelectRoomType(roomType.id)}
                                />
                                <MdDelete
                                    className="btn delete"
                                    onClick={() => {
                                        showConfirmDialog(
                                            roomType.id,
                                            dialogTypes.DELETE_CONFIRM,
                                            cardType.TYPE,
                                        );
                                    }}
                                />
                            </span>
                        </li>
                    ))}
                </ul>
            </Card>
        </>
    );
};

export default reduxForm({
    form: ROOM_FORM_TYPE,
})(RoomTypeForm);
