import React from 'react';

import TextField from '@mui/material/TextField';

const renderTextField = ({ label, input, meta: { touched, invalid, error }, ...custom }) => {
    return (
        <TextField
            label={label}
            placeholder={label}
            error={touched && invalid}
            helperText={touched && error}
            {...input}
            {...custom}
        />
    );
};

export default renderTextField;
