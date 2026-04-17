import React from 'react';

import FormHelperText from '@mui/material/FormHelperText';

export const renderFromHelper = ({ touched, error }) => {
    if (touched && error) {
        return <FormHelperText>{touched && error}</FormHelperText>;
    }
    return null;
};
