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
import TextFormField from '../../Fields/TextFormField';
import EditButton from '../../Buttons/EditButton';
import DeleteButton from '../../Buttons/DeleteButton';

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
            <Card additionClassName="form-card room-type-card">
                <form className="room-type-form" onSubmit={handleSubmit}>
                    <TextFormField
                        type="text"
                        name="description"
                        placeholder={t(ADD_TYPE_LABEL)}
                        label={t(NEW_TYPE_LABEL)}
                        variant="outlined"
                    />
                    <div className="btn-type-form-wrapper">
                        <Button
                            color="primary"
                            className="type-form-btn"
                            disabled={pristine || submitting}
                            variant="contained"
                            type="submit"
                        >
                            {t(SAVE_BUTTON_LABEL)}
                        </Button>
                    </div>
                </form>

                <ul className="form-types-list">
                    {roomTypes.map((roomType) => (
                        <li
                            key={roomType.id}
                            value={roomType.description}
                            className="form-types-item"
                        >
                            <span className="form-types">{roomType.description}</span>
                            <span>
                                <EditButton onClick={() => setSelectRoomType(roomType.id)} />
                                <DeleteButton
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
