import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormWrapper from '../../../share/FormWrapper/FormWrapper';
import { RHFTextField } from '../../../share/rhf';
import {
    CREATE_TITLE,
    EDIT_TITLE,
    ROOM_LABEL,
    ROOM_Y_LABEL,
    FORM_ROOM_LABEL_AFTER,
    FORM_TYPE_LABEL,
} from '../../../constants/translationLabels/formElements';
import './RoomForm.scss';

const RoomForm = ({ oneRoom, roomTypes, rooms, onSubmit, clearRoomItem }) => {
    const { t } = useTranslation('formElements');

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm({
        defaultValues: {
            name: '',
            type: null,
            afterId: null,
        },
    });

    useEffect(() => {
        if (oneRoom?.id) {
            const roomIndex = rooms.findIndex(({ id }) => id === oneRoom.id);
            const afterId = rooms[roomIndex - 1] || null;
            reset({
                name: oneRoom.name,
                type: roomTypes.find((rt) => rt.id === oneRoom.type?.id) || null,
                afterId,
            });
        } else {
            reset({ name: '', type: null, afterId: null });
        }
    }, [oneRoom?.id]);

    const onFormSubmit = (data) => {
        onSubmit({
            ...data,
            type: data.type?.id,
            afterId: data.afterId,
            ...(oneRoom?.id && { id: oneRoom.id }),
        });
        reset({ name: '', type: null, afterId: null });
    };

    const handleReset = () => {
        clearRoomItem();
        reset({ name: '', type: null, afterId: null });
    };

    const roomsForAutocomplete = oneRoom?.id
        ? rooms.filter((r) => r.id !== oneRoom.id)
        : rooms;

    return (
        <FormWrapper
            title={`${oneRoom?.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} ${t(ROOM_Y_LABEL)}`}
            onSubmit={handleSubmit(onFormSubmit)}
            onReset={handleReset}
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            entityId={oneRoom?.id}
        >
            <RHFTextField
                control={control}
                name="name"
                label={`${t(ROOM_LABEL)}:`}
                className="form-field"
                rules={{ required: t('required') }}
            />
            <Controller
                name="type"
                control={control}
                rules={{ required: t('required') }}
                render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                        {...field}
                        options={roomTypes}
                        getOptionLabel={(item) => item?.description || ''}
                        onChange={(_, value) => field.onChange(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                className="form-field"
                                label={t(FORM_TYPE_LABEL)}
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                )}
            />
            <Controller
                name="afterId"
                control={control}
                render={({ field }) => (
                    <Autocomplete
                        {...field}
                        options={roomsForAutocomplete}
                        getOptionLabel={(item) => item?.name || ''}
                        onChange={(_, value) => field.onChange(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                className="form-field"
                                label={t(FORM_ROOM_LABEL_AFTER)}
                            />
                        )}
                    />
                )}
            />
        </FormWrapper>
    );
};

export default RoomForm;