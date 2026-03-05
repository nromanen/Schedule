import React from 'react';
import {Controller} from 'react-hook-form';
import TextField from '@material-ui/core/TextField';

const RHFTextField = ({control, name, rules, label, ...rest}) => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field, fieldState: {error}}) => (
            <TextField
                {...field}
                label={label}
                error={!!error}
                helperText={error?.message}
                {...rest}
            />
        )}
    />
);

export default RHFTextField;