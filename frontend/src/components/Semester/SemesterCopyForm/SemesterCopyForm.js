import React from 'react';
import { Field } from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { MdPlayArrow } from 'react-icons/md';
import SelectField from '../../../share/renderedFields/select';
import './SemesterCopyForm.scss';
import { required } from '../../../validation/validateFields';
import {
    FORM_SEMESTER_LABEL,
    FORM_SEMESTER_COPY_RED_HINT,
    FORM_SEMESTER_COPY_HINT,
} from '../../../constants/translationLabels/formElements';
import { TEACHER_SCHEDULE_LABEL } from '../../../constants/translationLabels/common';

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
    const { semesterId, semesters, handleSubmit, pristine, submitting, submitButtonLabel } = props;

    const renderSemesterList = () => {
        const availableSemestersForCopy = semesters.filter(
            (semester) => semester.id !== semesterId,
        );
        if (availableSemestersForCopy && availableSemestersForCopy.length > 1) {
            return (
                <>
                    <Field
                        id="toSemesterId"
                        name="toSemesterId"
                        component={SelectField}
                        label={t(FORM_SEMESTER_LABEL)}
                        type="text"
                        validate={[required]}
                    >
                        <option />
                        {availableSemestersForCopy.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester.description}
                            </option>
                        ))}
                    </Field>
                </>
            );
        }
        if (availableSemestersForCopy && availableSemestersForCopy.length === 1) {
            return <p>{availableSemestersForCopy[0].description}</p>;
        }
        return null;
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
                        {submitButtonLabel}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default SemesterCopyForm;
