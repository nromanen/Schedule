import React from "react";

import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'

import {renderFromHelper} from './error';

const renderMultiSelectField = ({
                               input,
                               label,
                               name,
                               id,
                               meta: { touched, error },
                               children,
                               ...custom
                           }) => (
    <FormControl error={touched && !!error}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Select
            isMulti={true}
            native
            {...input}
            {...custom}
            name={name}
            id={id}
        >
            {children}
        </Select>
        {renderFromHelper({ touched, error })}
    </FormControl>
)

export default renderMultiSelectField;
