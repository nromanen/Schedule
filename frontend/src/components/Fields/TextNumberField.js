import { Field } from 'redux-form';
import React from 'react';
import renderTextField from '../../share/renderedFields/input';

const TextNumberField = (props) => {
    return <Field className="form-field" component={renderTextField} type="number" {...props} />;
};
export default TextNumberField;
