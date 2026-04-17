import { MenuItem, TextField } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { places } from '../../constants/places';
import { PLACE_FOR_CLASS_LABEL } from '../../constants/translationLabels/common';

const SelectPlace = (props) => {
    const { place, changePlace } = props;
    const { t } = useTranslation('common');

    const setPlace = ({ target }) => {
        if (target) {
            changePlace(target.value);
            localStorage.setItem('place', target.value);
        }
    };

    return (
        <div id="select-place">
            <TextField
                select
                className="place"
                id="demo-controlled-open-select"
                label={t(PLACE_FOR_CLASS_LABEL)}
                value={place}
                onChange={setPlace}
            >
                {Object.entries(places).map(([key, value]) => (
                    <MenuItem value={value} key={key}>
                        {t(`${value}_label`)}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
};

export default SelectPlace;