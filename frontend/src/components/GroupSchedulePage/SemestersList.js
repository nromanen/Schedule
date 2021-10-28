import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import { FORM_SEMESTER_LABEL } from '../../constants/translationLabels/formElements';
import SelectField from '../../share/renderedFields/select';

const SemestersList = (props) => {
    const { semesters, handleSubmit, scheduleSemesterId, getAllGroups } = props;
    const { t } = useTranslation('common');
    const [semesterId, setSemesterId] = useState(scheduleSemesterId);

    useEffect(() => {
        getAllGroups(semesterId);
    }, [semesterId]);

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

export default SemestersList;
