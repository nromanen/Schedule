import React from 'react';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import * as moment from 'moment';
import { timeFormat } from '../../constants/formats';

const keyboardTimePicker = ({
    label,
    input: { value, ...inputProps },
    meta: { touched, invalid, error },
    ...custom
}) => {
    console.log(inputProps, custom);
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardTimePicker
                ampm={false}
                minDate={new Date()}
                placeholder={`${custom.placeholder || '08:20'}`}
                clearable
                mask="__:__"
                error={touched && invalid}
                format={timeFormat}
                helperText={touched && error ? touched && error : label}
                {...inputProps}
                {...custom}
                value={value ? moment(value, 'HH:mm').toDate() : null}
            />
        </MuiPickersUtilsProvider>
    );
};

export default keyboardTimePicker;
