import React, { useEffect } from 'react';
import { Field } from 'redux-form';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import './AddGroupForms.scss';

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
import { renderAutocompleteField } from '../../helper/renderAutocompleteField';

export const AddGroup = props => {
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

    const removeCurrentGroup = () => groups.filter(el => el.id !== group.id);

    const groupsForAfterId = group.id ? removeCurrentGroup() : groups;

    useEffect(() => {
        const groupIndex = groups.findIndex(({ id }) => id === group.id);
        const afterId = groups.find((item, index) => index === groupIndex - 1);
        if (group.id) {
            initialize({
                id: group.id,
                title: group.title,
                afterId,
            });
        } else {
            initialize();
        }
    }, [group.id]);

    const submitGroup = data => {
        const afterId = data.afterId ? data.afterId.id : null;
        submitGroupStart({ ...data, disable: false, afterId });
        setGroup({});
        // console.log(data);
        // console.log({ ...data, disable: false, afterId });
    };

    const onReset = () => {
        setGroup({});
        clearGroupStart();
    };

    return (
        <div className="group-form">
            <h3 className="group-form-title">
                {group.id ? t(EDIT_TITLE) : t(CREATE_TITLE)}
                {t(GROUP_Y_LABEL)}
            </h3>
            <form onSubmit={handleSubmit(data => submitGroup(data))}>
                <Field
                    className="form-field"
                    name="title"
                    id="title"
                    label={`${t(GROUP_LABEL)}:`}
                    component={renderTextField}
                    validate={[required, minLengthValue]}
                />
                <Field
                    name="afterId"
                    component={renderAutocompleteField}
                    label={t(FORM_GROUP_LABEL_AFTER)}
                    type="text"
                    values={groupsForAfterId}
                    getOptionLabel={item => (item ? item.title : '')}
                ></Field>
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
