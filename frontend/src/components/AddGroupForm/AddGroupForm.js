import React, { useEffect } from 'react';
import { Field } from 'redux-form';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import './AddGroupForms.scss';
import Card from '../../share/Card/Card';
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
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, onReset, submitting, group, initialize, submitGroupStart } =
        props;

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
    return (
        <Card additionClassName="form-card group-form">
            <h2 className="group-form__title">
                {group.id ? t(EDIT_TITLE) : t(CREATE_TITLE)}
                {t(GROUP_Y_LABEL)}
            </h2>
            <form onSubmit={handleSubmit(submitGroupStart.bind(this))}>
                <Field
                    className="form-field"
                    name="title"
                    id="title"
                    label={`${t(GROUP_LABEL)}:`}
                    component={renderTextField}
                    validate={[required, minLengthValue, uniqueGroup]}
                />
                <div className="form-buttons-container group-btns">
                    <Button
                        variant="contained"
                        className="buttons-style "
                        color="primary"
                        disabled={pristine || submitting}
                        type="submit"
                    >
                        {t(SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
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
        </Card>
    );
};
