import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import renderSelectField from '../../share/renderedFields/select';

import './CopyLessonsFromSemesterForm.scss';
import Card from '../../share/Card/Card';

import { COPY_LESSONS_FROM_SEMESTER_FORM } from '../../constants/reduxForms';
import { required } from '../../validation/validateFields';
import {
    FORM_SEMESTER_LABEL,
    COPY_LESSON,
    COPY_LESSONS_FROM_SEMESTER,
    FORM_COPY_LESSON,
} from '../../constants/translationLabels';

const shortid = require('shortid');

const CopyLessonsFromSemesterForm = (props) => {
    const { t } = useTranslation('common');
    const { semesters, handleSubmit, pristine, submitting } = props;
    const renderSemesterList = () => {
        if (semesters) {
            if (semesters.length > 1) {
                return (
                    <Field
                        id="fromSemesterId"
                        name="fromSemesterId"
                        component={renderSelectField}
                        label={t(FORM_SEMESTER_LABEL)}
                        type="text"
                        validate={[required]}
                    >
                        <option />
                        {semesters.map((semester, index) => (
                            <option key={shortid.generate()} value={semester.id}>
                                {semester.description}
                            </option>
                        ))}
                    </Field>
                );
            }
            if (semesters.length === 1) {
                handleSubmit({ fromSemesterId: semesters[0].id });
                return <p>{semesters[0].description}</p>;
            }
        }
    };

    return (
        <Card class="form-card">
            <form onSubmit={handleSubmit}>
                <h2 className="lesson-page-h">{t(COPY_LESSON)}</h2>
                <p>{t(COPY_LESSONS_FROM_SEMESTER)}</p>
                {renderSemesterList()}
                <div className="form-buttons-container">
                    <Button
                        className="semester-copy-btn"
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={pristine || submitting}
                    >
                        {t(FORM_COPY_LESSON)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    semesters: state.semesters.semesters,
    currentSemester: state.schedule.currentSemester,
});
export default connect(mapStateToProps)(
    reduxForm({
        form: COPY_LESSONS_FROM_SEMESTER_FORM,
    })(CopyLessonsFromSemesterForm),
);
