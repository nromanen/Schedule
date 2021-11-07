import React, { useEffect } from 'react';
import { Field } from 'redux-form';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import './AddGroupForms.scss';
import renderTextField from '../../share/renderedFields/input';
import { required, uniqueGroup, minLengthValue } from '../../validation/validateFields';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import {
    SAVE_BUTTON_LABEL,
    GROUP_Y_LABEL,
    CREATE_TITLE,
    GROUP_LABEL,
    EDIT_TITLE,
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
        group,
    } = props;
    const { t } = useTranslation('formElements');

    useEffect(() => {
        if (group.id) {
            initialize({
                id: group.id,
                title: group.title,
            });
        } else {
            initialize();
        }
    }, [group.id]);

    const onReset = () => {
        setGroup({});
        clearGroupStart();
    };

    return (
        <div className="group-form">
            <div className="group-form__title">
                {group.id ? t(EDIT_TITLE) : t(CREATE_TITLE)}
                {t(GROUP_Y_LABEL)}
            </div>
            <form
                // className="group-form"
                onSubmit={handleSubmit((data) => {
                    submitGroupStart(data);
                    setGroup({});
                })}
            >
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
                        className="buttons-style size"
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
