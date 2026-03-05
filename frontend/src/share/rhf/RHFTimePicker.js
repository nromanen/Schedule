import React from 'react';
import {Controller} from 'react-hook-form';
import {MuiPickersUtilsProvider, TimePicker} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import * as moment from 'moment';

const RHFTimePicker = ({control, name, rules, label, onChange: onChangeProp, ...rest}) => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field: {onChange, value}, fieldState: {error}}) => (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <TimePicker
                    clearable
                    ampm={false}
                    label={label}
                    value={value ? moment(value, 'HH:mm').toDate() : null}
                    onChange={(val) => {
                        const formatted = val ? moment(val).format('HH:mm') : null;
                        onChange(formatted);
                        if (onChangeProp) onChangeProp(formatted);
                    }}
                    format="HH:mm"
                    error={!!error}
                    helperText={error?.message}
                    InputProps={{
                        style: {color: value ? 'inherit' : '#9c9c9c'},
                    }}
                    {...rest}
                />
            </MuiPickersUtilsProvider>
        )}
    />
);

export default RHFTimePicker;