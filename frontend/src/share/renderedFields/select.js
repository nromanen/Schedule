import React, {useState} from 'react';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

import {renderFromHelper} from './error';

const SelectField = (props) => {
    const {
        input,
        label,
        name,
        id,
        meta: { touched, error },
        children,
        className,
        ...custom
    } = props;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <FormControl
            className={className}
            error={touched && !!error}
            onClick={() => setIsOpen((state) => !state)}
        >
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <Select {...input} {...custom} name={name} id={id} open={isOpen}>
                {children}
            </Select>
            {renderFromHelper({ touched, error })}
        </FormControl>
    );
};

export default SelectField;
