import React from 'react';

import FormHelperText from '@material-ui/core/FormHelperText';

export const renderFromHelper = ({ touched, error }) => {
    if (!(touched && error)) {
    } else {
        return <FormHelperText>{touched && error}</FormHelperText>;
    }
};
