import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import './AddSubjectForm.scss';
import Card from '../../share/Card/Card';
import { SUBJECT_FORM } from '../../constants/reduxForms';
import renderTextField from '../../share/renderedFields/input';
import { required, uniqueSubject, maxLengthValue } from '../../validation/validateFields';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';

const AddSubject = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, onReset, submitting, subject } = props;

    useEffect(() => {
        if (props.subject) {
            if (props.subject.id) {
                props.initialize({
                    id: props.subject.id,
                    name: props.subject.name,
                });
            } else {
                props.initialize();
            }
        }
    }, [props.subject]);

    return (
        <Card class="form-card subject-form">
            <h2 style={{ textAlign: 'center' }}>
                {props.subject.id ? t('edit_title') : t('create_title')}
                {t('subject_y_label')}
            </h2>
            <form onSubmit={handleSubmit}>
                <Field
                    className="form-field"
                    name="name"
                    component={renderTextField}
                    label={`${t('subject_label')}:`}
                    validate={[required, uniqueSubject, maxLengthValue]}
                />
                <div className="form-buttons-container subject-btns">
                    <Button
                        variant="contained"
                        color="primary"
                        className="buttons-style "
                        disabled={pristine || submitting}
                        type="submit"
                    >
                        {t('save_button_label')}
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        className="buttons-style"
                        disabled={setDisableButton(pristine, submitting, subject.id)}
                        onClick={onReset}
                    >
                        {getClearOrCancelTitle(subject.id, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    subject: state.subjects.subject,
});

export default connect(mapStateToProps)(
    reduxForm({
        form: SUBJECT_FORM,
    })(AddSubject),
);
