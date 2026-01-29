// frontend/src/containers/GroupSchedulePage/DepartmentsList.js
import { connect } from 'react-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import { renderAutocompleteField } from '../../helper/renderAutocompleteField';
import { FORM_DEPARTMENT_TEACHERS_LABEL } from '../../constants/translationLabels/formElements';

const DepartmentsList = (props) => {
    const { departments, handleChange } = props;
    const { t } = useTranslation('common');

    return (
        <Field
            name="department"
            component={(values) => renderAutocompleteField(values)}
            label={t(FORM_DEPARTMENT_TEACHERS_LABEL)}
            type="text"
            handleChange={() => {
                handleChange('group', null);
                handleChange('teacher', null);
            }}
            values={departments}
            getOptionLabel={(department) => (department ? department.name : '')}
            className="schedule-form_department"
        />
    );
};

const mapStateToProps = (state) => ({
    departments: state.departments.departments,
});

export default connect(mapStateToProps)(DepartmentsList);