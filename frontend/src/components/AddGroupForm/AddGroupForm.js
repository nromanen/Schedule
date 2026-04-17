import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import FormWrapper from '../../share/FormWrapper/FormWrapper';
import { RHFTextField } from '../../share/rhf';
import {
    useCreateGroup,
    useUpdateGroup,
    ENABLED_GROUPS_QUERY_KEY,
    DISABLED_GROUPS_QUERY_KEY,
} from '../../hooks/useGroups';
import {
    CREATE_TITLE,
    EDIT_TITLE,
    FORM_GROUP_LABEL_AFTER,
    GROUP_LABEL,
    GROUP_Y_LABEL,
} from '../../constants/translationLabels/formElements';
import { queryClient } from '../../queryClient';
import { checkUniqueGroup } from '../../validation/storeValidation';

const AddGroup = ({ group, setGroup }) => {
    const createGroup = useCreateGroup();
    const updateGroup = useUpdateGroup();
    const { t } = useTranslation('formElements');

    const enabledGroups = queryClient.getQueryData([ENABLED_GROUPS_QUERY_KEY]) || [];
    const disabledGroups = queryClient.getQueryData([DISABLED_GROUPS_QUERY_KEY]) || [];
    const groups = [...enabledGroups, ...disabledGroups];

    const groupsForAutocomplete = group?.id
        ? groups.filter((el) => el.id !== group.id)
        : groups;

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            title: '',
            afterId: null,
        },
    });

    useEffect(() => {
        if (group?.id) {
            const groupIndex = groups.findIndex(({ id }) => id === group.id);
            const afterId = groups[groupIndex - 1] || null;
            reset({ title: group.title, afterId });
        } else {
            reset({ title: '', afterId: null });
        }
    }, [group?.id, group?.title]);

    const onFormSubmit = (data) => {
        const afterId = data.afterId ? data.afterId.id : null;
        const payload = { ...data, title: data.title.trim(), disable: false, afterId, id: group?.id };
        group?.id ? updateGroup.mutate(payload) : createGroup.mutate(payload);
        setGroup({});
        reset({ title: '', afterId: null });
    };

    const handleReset = () => {
        setGroup({});
        reset({ title: '', afterId: null });
    };

    return (
        <FormWrapper
            title={`${group?.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} ${t(GROUP_Y_LABEL)}`}
            onSubmit={handleSubmit(onFormSubmit)}
            onReset={handleReset}
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            entityId={group?.id}
        >
            <RHFTextField
                control={control}
                name="title"
                label={`${t(GROUP_LABEL)}:`}
                className="form-field"
                rules={{
                    required: t('required'),
                    validate: (value) => checkUniqueGroup(value, groups, group?.id),
                }}
            />
            <Controller
                name="afterId"
                control={control}
                render={({ field }) => (
                    <Autocomplete
                        {...field}
                        options={groupsForAutocomplete}
                        getOptionLabel={(item) => item?.title || ''}
                        onChange={(_, value) => field.onChange(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                className="form-field"
                                label={t(FORM_GROUP_LABEL_AFTER)}
                            />
                        )}
                    />
                )}
            />
        </FormWrapper>
    );
};

export default AddGroup;