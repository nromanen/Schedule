import React from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import { FORM_TEACHER_LABEL } from '../../constants/translationLabels/formElements';
import { getTeacherFullName } from '../../helper/renderTeacher';
import SelectField from '../../share/renderedFields/select';

const TeachersList = (props) => {
    const { teachers, handleChange } = props;
    const { t } = useTranslation('common');
    return (
        <Field
            id="teacher"
            name="teacher"
            component={SelectField}
            label={t(FORM_TEACHER_LABEL)}
            type="text"
            onChange={() => {
                handleChange('group', null);
            }}
        >
            <option className="option-item" value={0} />
            {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id} className="option-item">
                    {getTeacherFullName(teacher)}
                </option>
            ))}
        </Field>
    );
};

export default TeachersList;
