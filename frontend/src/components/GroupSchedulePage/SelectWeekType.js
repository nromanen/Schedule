import { MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { week_types } from '../../constants/week_types';
import { WEEK_TYPE_LABEL } from '../../constants/translationLabels/common';

const SelectWeekType = (props) => {

    const { t } = useTranslation('common');

    const setWeekType = ({ target }) => {
        if (target) {
            props.setWeekType(target.value);
            localStorage.setItem('week_type', target.value);
        }
    };

    return (
        <div id="select-place">
            <label htmlFor="demo-controlled-open-select">{t(WEEK_TYPE_LABEL)}</label>
            <Select
                className="place"
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={props.week_type}
                onChange={setWeekType}
            >
                {Object.entries(week_types).map(([key, value]) => (
                    <MenuItem value={value} key={key}>
                        {t(`${value}_label`)}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

export default SelectWeekType;
