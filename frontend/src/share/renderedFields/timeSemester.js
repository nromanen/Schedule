import React from 'react';
import MomentUtils from '@date-io/moment';
import * as moment from 'moment';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

const renderMounthPicker = ({
    label,
    input: { value, ...inputProps },
    meta: { touched, invalid, error },
    ...custom
}) => {
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
                minDate={new Date()}
                clearable
                value={value ? moment(value, 'DD/MM/YYYY').toDate() : null}
                format="DD/MM/YYYY"
                error={touched && invalid}
                helperText={touched && error ? touched && error : label}
                {...inputProps}
                {...custom}
            />
        </MuiPickersUtilsProvider>
    );
};
export default renderMounthPicker;
