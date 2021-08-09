import Multiselect from 'react-widgets/Multiselect';
import React from 'react';

export const renderMultiselect = ({ input, data, valueField, textField, placeholder,
                                      meta: { touched, invalid, error } }) =>
    <>

        <Multiselect {...input}
                     onBlur={() => input.onBlur()}
                     value={input.value || []}
                     data={data}
                     valueField={valueField}
                     textField={textField}
                     placeholder={placeholder}
        />

    </>