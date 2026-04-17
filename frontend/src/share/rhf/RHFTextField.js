import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

const sanitize = (str) =>
    str
        .replace(/\s+/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();

const RHFTextField = ({ control, name, rules, label, ...rest }) => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
            <TextField
                {...field}
                label={label}
                error={!!error}
                helperText={error?.message}
                onPaste={(e) => {
                    e.preventDefault();
                    const pasted = e.clipboardData.getData('text');
                    const clean = sanitize(pasted);

                    const input = e.target;
                    const start = input.selectionStart ?? 0;
                    const end = input.selectionEnd ?? 0;
                    const newValue =
                        input.value.slice(0, start) + clean + input.value.slice(end);

                    field.onChange(newValue);

                    requestAnimationFrame(() => {
                        input.setSelectionRange(start + clean.length, start + clean.length);
                    });
                }}
                {...rest}
            />
        )}
    />
);

export default RHFTextField;