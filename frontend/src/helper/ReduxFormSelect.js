import Select from 'react-select';
import React from 'react';

export const ReduxFormSelect = (props) => {
    const { options } = props;
    return <Select options={options} />;
};
