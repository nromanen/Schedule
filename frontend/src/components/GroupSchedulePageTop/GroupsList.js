import { isEmpty } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { FORM_GROUP_LABEL } from '../../constants/translationLabels/formElements';
import SelectField from '../../share/renderedFields/select';

const GroupsList = (props) => {
    const { handleChange, groups } = props;
    const { t } = useTranslation('common');

    return (
        <Field
            disabled={isEmpty(groups)}
            id="group"
            name="group"
            component={SelectField}
            label={t(FORM_GROUP_LABEL)}
            type="text"
            onChange={() => {
                handleChange('teacher', 0);
            }}
        >
            <option className="option-item" value={0} />
            {groups.map((group) => (
                <option key={group.id} value={group.id} className="option-item">
                    {group.title}
                </option>
            ))}
        </Field>
    );
};

const mapStateToProps = (state) => {
    return {
        groups: state.groups.groups,
    };
};

export default connect(mapStateToProps)(GroupsList);
