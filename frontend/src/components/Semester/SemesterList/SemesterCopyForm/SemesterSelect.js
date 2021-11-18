import React from 'react';
import { Field } from 'redux-form';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import SelectField from '../../../../share/renderedFields/select';
import './SemesterCopyForm.scss';
import { required } from '../../../../validation/validateFields';
import { FORM_SEMESTER_LABEL } from '../../../../constants/translationLabels/formElements';

const SemesterSelect = (props) => {
    const { t } = useTranslation('common');
    const { semesterId, semesters } = props;
    const availableSemestersForCopy = semesters.filter((semester) => semester.id !== semesterId);
    if (!isEmpty(availableSemestersForCopy)) {
        return (
            <>
                <Field
                    id="toSemesterId"
                    name="toSemesterId"
                    component={SelectField}
                    label={t(FORM_SEMESTER_LABEL)}
                    type="text"
                    validate={[required]}
                    className="semester-copy-select"
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
    return null;
};

export default SemesterSelect;
