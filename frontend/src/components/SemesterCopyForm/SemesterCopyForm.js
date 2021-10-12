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
import {
    FORM_SEMESTER_LABEL,
    FORM_SEMESTER_COPY_RED_HINT,
    FORM_SEMESTER_COPY_HINT,
} from '../../constants/translationLabels/formElements';
import { TEACHER_SCHEDULE_LABEL } from '../../constants/translationLabels/common';

const shortid = require('shortid');

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

const SemesterCopyForm = (props) => {
    const classes = useStyles();
    const { t } = useTranslation('common');
    const { semesterId, semesters, handleSubmit, pristine, submitting } = props;

    const renderSemesterList = () => {
        const available_semesters_for_copy = semesters.filter(
            (semester) => semester.id !== semesterId,
        );
        if (available_semesters_for_copy) {
            if (available_semesters_for_copy.length > 1) {
                return (
                    <>
                        <Field
                            id="toSemesterId"
                            name="toSemesterId"
                            component={renderSelectField}
                            label={t(FORM_SEMESTER_LABEL)}
                            type="text"
                            validate={[required]}
                        >
                            <option />
                            {available_semesters_for_copy.map((semester, index) => (
                                <option key={shortid.generate()} value={semester.id}>
                                    {semester.description}
                                </option>
                            ))}
                        </Field>
                    </>
                );
            }
            if (available_semesters_for_copy.length === 1) {
                return <p>{available_semesters_for_copy[0].description}</p>;
            }
        }
    };

    return (
        <section className={classes.root}>
            <p>{t(FORM_SEMESTER_COPY_HINT)}</p>
            <p className="red-color">{t(FORM_SEMESTER_COPY_RED_HINT)}</p>
            <form onSubmit={handleSubmit}>
                <div className="form-buttons-container">
                    {renderSemesterList()}
                    <Button
                        className="semester-copy-btn"
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={pristine || submitting}
                    >
                        <MdPlayArrow title={t(TEACHER_SCHEDULE_LABEL)} className="svg-btn" />
                        {props.submitButtonLabel}
                    </Button>
                </div>
            </form>
        </section>
    );
};

const mapStateToProps = (state) => ({
    semesters: state.semesters.semesters,
});
export default connect(mapStateToProps)(
    reduxForm({
        form: SEMESTER_COPY_FORM,
    })(SemesterCopyForm),
);
