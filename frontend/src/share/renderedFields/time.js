import React from 'react';
import MomentUtils from '@date-io/moment';
import * as moment from 'moment';
import {MuiPickersUtilsProvider, TimePicker} from '@material-ui/pickers';

const renderTimePicker = ({
    label,
    input: { value, ...inputProps },
    meta: { touched, invalid, error },
    ...custom
}) => {
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <TimePicker
                clearable
                ampm={false}
                value={value ? moment(value, 'HH:mm').toDate() : null}
                error={touched && invalid}
                helperText={touched && error ? touched && error : label}
                format="HH:mm"
                InputProps={{
                    style: {
                        color: value ? 'inherit' : '#9c9c9c'
                    }
                }}
                {...inputProps}
                {...custom}
            />
        </MuiPickersUtilsProvider>
    );
};

export default renderTimePicker;
