import React, { useState } from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import { renderFromHelper } from './error';

const SelectField = (props) => {
    const {
        input,
        label,
        name,
        id,
        meta: { touched, error },
        children,
        ...custom
    } = props;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <FormControl error={touched && !!error} onClick={() => setIsOpen((state) => !state)}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <Select {...input} {...custom} name={name} id={id} open={isOpen}>
                {children}
            </Select>
            {renderFromHelper({ touched, error })}
        </FormControl>
    );
};

export default SelectField;
