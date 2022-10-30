import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { TYPE_TO_SEARCH } from '../../constants/translationLabels/formElements';

const SearchTextField = (props) => {
    const { t } = useTranslation('formElements');
    return (
        <TextField
            className="form-field"
            label={<FaSearch />}
            placeholder={t(TYPE_TO_SEARCH)}
            {...props}
            onChange={(e) => {
                props.onChange({
                    ...e,
                    target: { ...e.target, value: e.target.value.replace(/^\s+/, '') },
                });
            }}
        />
    );
};
export default SearchTextField;
