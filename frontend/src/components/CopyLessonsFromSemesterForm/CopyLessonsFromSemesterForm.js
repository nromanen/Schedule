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
const shortid = require('shortid');

const CopyLessonsFromSemesterForm = props => {
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
                        label={t('formElements:semester_label')}
                        type="text"
                        validate={[required]}
                    >
                        <option />
                        {semesters.map((semester, index) => (
                            <option
                                key={shortid.generate()}
                                value={semester.id}
                            >
                                {semester.description}
                            </option>
                        ))}
                    </Field>
                );
            } else if (semesters.length === 1) {
                handleSubmit({ fromSemesterId: semesters[0].id });
                return <p>{semesters[0].description}</p>;
            }
        }
    };

    return (
        <Card class="form-card">
            <form onSubmit={handleSubmit}>
                <h2 className="lesson-page-h">{t('copy_lesson')}</h2>
                <p>{t('copy_lessons_from_semester_to_current')}</p>
                {renderSemesterList()}
                <div className="form-buttons-container">
                    <Button
                        className='semester-copy-btn'
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={pristine || submitting}
                    >
                        {t('formElements:copy_label')}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const mapStateToProps = state => ({
    semesters: state.semesters.semesters,
    currentSemester: state.schedule.currentSemester
});
export default connect(mapStateToProps)(
    reduxForm({
        form: COPY_LESSONS_FROM_SEMESTER_FORM
    })(CopyLessonsFromSemesterForm)
);
