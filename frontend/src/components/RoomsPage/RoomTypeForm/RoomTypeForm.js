import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import Card from '../../../share/Card/Card';
import FormWrapper from '../../../share/FormWrapper/FormWrapper';
import { RHFTextField } from '../../../share/rhf';
import { cardType } from '../../../constants/cardType';
import { dialogTypes } from '../../../constants/dialogs';
import {
    ADD_TYPE_LABEL,
    NEW_TYPE_LABEL,
} from '../../../constants/translationLabels/formElements';
import './RoomTypeForm.scss';

const RoomTypeForm = ({ roomTypes, oneType, setSelectRoomType, showConfirmDialog, onSubmit }) => {
    const { t } = useTranslation('formElements');

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm({
        defaultValues: { description: '' },
    });

    useEffect(() => {
        reset(oneType?.id ? { description: oneType.description } : { description: '' });
    }, [oneType?.id, oneType?.description]);

    const onFormSubmit = (data) => {
        onSubmit({ ...data, ...(oneType?.id && { id: oneType.id }) });
        reset({ description: '' });
    };

    const handleReset = () => {
        setSelectRoomType(null);
        reset({ description: '' });
    };

    return (
        <Card additionClassName="form-card room-type-card">
            <FormWrapper
                noCard
                title={t(ADD_TYPE_LABEL)}
                onSubmit={handleSubmit(onFormSubmit)}
                onReset={handleReset}
                isDirty={isDirty}
                isSubmitting={isSubmitting}
                entityId={oneType?.id}
            >
                <RHFTextField
                    control={control}
                    name="description"
                    label={t(NEW_TYPE_LABEL)}
                    className="form-field"
                    rules={{ required: t('required') }}
                />
            </FormWrapper>

            <ul className="form-types-list">
                {roomTypes.map((roomType) => (
                    <li key={roomType.id} className="form-types-item">
                        <span className="form-types">{roomType.description}</span>
                        <span>
                    <FaEdit
                        className="room-type-icon room-type-icon_edit"
                        onClick={() => setSelectRoomType(roomType)}
                    />
                    <MdDelete
                        className="room-type-icon room-type-icon_delete"
                        onClick={() =>
                            showConfirmDialog(
                                roomType.id,
                                dialogTypes.DELETE_CONFIRM,
                                cardType.TYPE,
                            )
                        }
                    />
                </span>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default RoomTypeForm;