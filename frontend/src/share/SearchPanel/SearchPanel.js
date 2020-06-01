import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import './SearchPanel.scss';
import Card from '../../share/Card/Card';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const SearchPanel = ({ SearchChange, showDisabled }) => {
    const { t } = useTranslation('formElements');
    const [term, setTerm] = useState('');

    const [state, setState] = React.useState({
        checkedB: false
    });

    const handleChange = event => {
        setState({ ...state, [event.target.name]: event.target.checked });
        showDisabled();
    };

    const onSearchChange = e => {
        const term = e.target.value;
        setTerm(term);
        SearchChange(term);
    };

    return (
        <Card class="search-group">
            <FormControlLabel
                control={
                    <Switch
                        checked={state.checkedB}
                        onChange={handleChange}
                        name="checkedB"
                        color="primary"
                    />
                }
                label={
                    !state.checkedB
                        ? t('common:show_disabled')
                        : t('common:show_enabled')
                }
            />
            <TextField
                className="form-field"
                label={<FaSearch />}
                placeholder={t('type_to_search')}
                value={term}
                onChange={onSearchChange}
            />
        </Card>
    );
};

export default SearchPanel;
