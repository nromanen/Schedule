import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import { MdPlayArrow } from 'react-icons/md';

import renderSelectField from '../../share/renderedFields/select';

import './SemesterCopyForm.scss';

import { SEMESTER_COPY_FORM } from '../../constants/reduxForms';
import { required } from '../../validation/validateFields';
const shortid = require('shortid');

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1)
        }
    }
}));

const SemesterCopyForm = props => {
    const classes = useStyles();
    const { t } = useTranslation('common');
    const { semesterId, semesters, handleSubmit, pristine, submitting } = props;

    const renderSemesterList = () => {
        const available_semesters_for_copy = semesters.filter(
            semester => semester.id !== semesterId
        );
        if (available_semesters_for_copy) {
            if (available_semesters_for_copy.length > 1) {
                return (
                    <>
                        <Field
                            id="toSemesterId"
                            name="toSemesterId"
                            component={renderSelectField}
                            label={t('formElements:semester_label')}
                            type="text"
                            validate={[required]}
                        >
                            <option />
                            {available_semesters_for_copy.map(
                                (semester, index) => (
                                    <option
                                        key={shortid.generate()}
                                        value={semester.id}
                                    >
                                        {semester.description}
                                    </option>
                                )
                            )}
                        </Field>
                    </>
                );
            } else if (available_semesters_for_copy.length === 1) {
                return <p>{available_semesters_for_copy[0].description}</p>;
            }
        }
    };

    return (
        <section className={classes.root}>
            <p>{t('formElements:semester_copy_hint')}</p>
            <p className="red-color">
                {t('formElements:semester_copy_red_hint')}
            </p>
            <form onSubmit={handleSubmit}>
                <div className="form-buttons-container">
                    {renderSemesterList()}
                    <Button
                        className='semester-copy-btn'
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={pristine || submitting}
                    >
                        <MdPlayArrow
                            title={t('teacher_schedule_label')}
                            className="svg-btn"
                        />
                        {props.submitButtonLabel}
                    </Button>
                </div>
            </form>
        </section>
    );
};

const mapStateToProps = state => ({
    semesters: state.semesters.semesters
});
export default connect(mapStateToProps)(
    reduxForm({
        form: SEMESTER_COPY_FORM
    })(SemesterCopyForm)
);
