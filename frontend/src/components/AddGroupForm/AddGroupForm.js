import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import './AddGroupForms.scss';
import Card from '../../share/Card/Card';
import { GROUP_FORM } from '../../constants/reduxForms';
import renderTextField from '../../share/renderedFields/input';
import { required, uniqueGroup, minLengthValue } from '../../validation/validateFields';
import { links } from '../../constants/links';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import {
    EDIT_TITLE,
    CREATE_TITLE,
    SAVE_BUTTON_LABEL,
    GROUP_Y_LABEL,
    GROUP_LABEL,
} from '../../constants/translationLabels';

const AddGroup = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, onReset, submitting, match, group } = props;

    useEffect(() => {
        if (group && match.url.includes(links.Edit) && !match.url.includes(links.Student)) {
            if (group.id) {
                props.initialize({
                    id: group.id,
                    title: group.title,
                });
            } else {
                props.initialize();
            }
        }
    }, [group.id]);

    return (
        <Card class="form-card group-form">
            <h2 className="group-form__title">
                {group.id ? t(EDIT_TITLE) : t(CREATE_TITLE)}
                {t(GROUP_Y_LABEL)}
            </h2>
            <form onSubmit={handleSubmit}>
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

const mapStateToProps = (state) => ({
    group: state.groups.group,
});

export default connect(mapStateToProps)(
    reduxForm({
        form: GROUP_FORM,
    })(AddGroup),
);
