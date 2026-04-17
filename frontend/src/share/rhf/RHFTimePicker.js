import React from 'react';
import { Controller } from 'react-hook-form';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment';

const RHFTimePicker = ({ control, name, rules, label, onChange: onChangeProp, ...rest }) => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TimePicker
                ampm={false}
                label={label}
                value={value ? moment(value, 'HH:mm') : null}
                onChange={(val) => {
                    const formatted = val && val.isValid() ? val.format('HH:mm') : null;
                    onChange(formatted);
                    if (onChangeProp) onChangeProp(formatted);
                }}
                format="HH:mm"
                slotProps={{
                    textField: {
                        error: !!error,
                        helperText: error?.message,
                        InputProps: {
                            style: { color: value ? 'inherit' : '#9c9c9c' },
                        },
                    },
                    actionBar: {
                        actions: ['clear', 'cancel', 'accept'],
                    },
                }}
                {...rest}
            />
        )}
    />
);

export default RHFTimePicker;