import React, { useState, useEffect } from 'react';
import { Field } from 'redux-form';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import './AddGroupForms.scss';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import renderTextField from '../../share/renderedFields/input';
import { required, uniqueGroup, minLengthValue } from '../../validation/validateFields';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import {
    EDIT_TITLE,
    GROUP_LABEL,
    CREATE_TITLE,
    GROUP_Y_LABEL,
    SAVE_BUTTON_LABEL,
    FORM_GROUP_LABEL_AFTER,
} from '../../constants/translationLabels/formElements';

export const AddGroup = (props) => {
    const {
        clearGroupStart,
        submitGroupStart,
        handleSubmit,
        initialize,
        submitting,
        setGroup,
        pristine,
        invalid,
        groups,
        group,
    } = props;
    const { t } = useTranslation('formElements');
    const [afterIdGroup, setAfterIdGroup] = useState(null);

    useEffect(() => {
        if (group.id) {
            initialize({
                id: group.id,
                title: group.title,
                afterId: afterIdGroup,
            });
        } else {
            initialize();
        }
    }, [group.id]);

    const submitGroup = (data) => {
        const afterId = afterIdGroup ? afterIdGroup.id : null;
        submitGroupStart({ ...data, disable: false, afterId });
        setGroup({});
        setAfterIdGroup(null);
    };

    const onReset = () => {
        setGroup({});
        clearGroupStart();
        setAfterIdGroup(null);
    };

    return (
        <div className="group-form">
            <h3 className="group-form-title">
                {group.id ? t(EDIT_TITLE) : t(CREATE_TITLE)}
                {t(GROUP_Y_LABEL)}
            </h3>
            <form onSubmit={handleSubmit((data) => submitGroup(data))}>
                <Autocomplete
                    id="group"
                    value={afterIdGroup}
                    options={groups}
                    className="group-lesson"
                    clearOnEscape
                    openOnFocus
                    getOptionLabel={(option) => option.title}
                    onChange={(_, newValue) => {
                        setAfterIdGroup(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            className="textField"
                            {...params}
                            label={t(FORM_GROUP_LABEL_AFTER)}
                            margin="normal"
                        />
                    )}
                />

                <Field
                    className="form-field"
                    name="title"
                    id="title"
                    label={`${t(GROUP_LABEL)}:`}
                    component={renderTextField}
                    validate={[required, minLengthValue, uniqueGroup]}
                />
                <div className="form-buttons-container">
                    <Button
                        size="small"
                        variant="contained"
                        className="buttons-style "
                        color="primary"
                        disabled={invalid || pristine || submitting}
                        type="submit"
                    >
                        {t(SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
                        size="small"
                        type="button"
                        className="buttons-style"
                        variant="contained"
                        disabled={setDisableButton(pristine, submitting, group.id)}
                        onClick={onReset}
                    >
                        {getClearOrCancelTitle(group.id, t)}
                    </Button>
                </div>
            </form>
        </div>
    );
};
