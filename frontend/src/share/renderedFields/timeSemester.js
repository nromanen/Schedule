import React from 'react';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { dateFormat } from '../../constants/formats';

const renderMonthPicker = ({
                               label,
                               input: { value, onChange, ...inputProps },
                               meta: { touched, invalid, error },
                               ...custom
                           }) => {
    return (
        <DatePicker
            minDate={moment()}
            value={value ? moment(value, dateFormat) : null}
            onChange={(val) => {
                onChange(val && val.isValid() ? val.format(dateFormat) : null);
            }}
            format="DD/MM/YYYY"
            slotProps={{
                textField: {
                    placeholder: '11/11/2021',
                    error: touched && invalid,
                    helperText: touched && error ? error : label,
                },
                actionBar: {
                    actions: ['clear', 'cancel', 'accept'],
                },
            }}
            {...inputProps}
            {...custom}
        />
    );
};

export default renderMonthPicker;