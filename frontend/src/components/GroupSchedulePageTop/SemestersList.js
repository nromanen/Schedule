import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { FORM_SEMESTER_LABEL } from '../../constants/translationLabels/formElements';
import { showAllPublicGroupsService } from '../../services/scheduleService';
import SelectField from '../../share/renderedFields/select';

const SemestersList = (props) => {
    const { semesters, handleSubmit, initialValues } = props;
    const { t } = useTranslation('common');
    const [semesterId, setSemesterId] = useState(initialValues.semester);

    useEffect(() => showAllPublicGroupsService(semesterId), [semesterId]);

    if (semesters && semesters.length > 1) {
        return (
            <Field
                id="semester"
                name="semester"
                component={SelectField}
                label={t(FORM_SEMESTER_LABEL)}
                type="text"
                onChange={(e) => setSemesterId(e.target.value)}
            >
                {semesters.map((semester) => (
                    <option key={semester.id} value={semester.id} className="option-item">
                        {semester.description}
                    </option>
                ))}
            </Field>
        );
    }
    if (semesters && semesters.length === 1) {
        handleSubmit({ semester: semesters[0].id });
        return <p>{semesters[0].description}</p>;
    }
    return null;
};

const mapStateToProps = (state) => {
    return {
        semesters: state.schedule.semesters,
        initialValues: {
            semester: state.schedule.scheduleSemesterId,
        },
    };
};

export default connect(mapStateToProps)(SemestersList);
