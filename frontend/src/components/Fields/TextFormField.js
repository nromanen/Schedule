import { Field } from 'redux-form';
import React from 'react';
import renderTextField from '../../share/renderedFields/input';

const TextFormField = (props) => {
    return (
        <Field
            className="form-field"
            component={renderTextField}
            normalize={(value) => value.replace(/^\s+/, '')}
            {...props}
        />
    );
};
export default TextFormField;
