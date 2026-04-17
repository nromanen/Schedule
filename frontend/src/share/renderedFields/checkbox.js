import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const renderCheckboxField = ({ custom, input, label, name, labelPlacement, checked }) => {
    return (
        <FormControlLabel
            labelPlacement={labelPlacement}
            label={label}
            name={name}
            checked={checked}
            control={<Checkbox color="primary" {...custom} {...input} />}
        />
    );
};

export default renderCheckboxField;
