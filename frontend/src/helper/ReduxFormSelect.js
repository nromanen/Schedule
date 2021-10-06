import Select from 'react-select';
import React from 'react';

export const ReduxFormSelect = (props) => {
    const { input, options } = props;
    return (
        <Select
            // onChange={value => input.onChange(value)}
            // onBlur={() => input.onBlur(input.value)}
            options={options}
        />
    );
};
