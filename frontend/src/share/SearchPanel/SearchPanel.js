import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import './SearchPanel.scss';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Card from '../Card/Card';

const SearchPanel = ({ SearchChange, showDisabled, showArchived, forLessons }) => {
    const { t } = useTranslation('formElements');
    const [term, setTerm] = useState('');

    const [state, setState] = React.useState({
        checkedB: false,
        checkedArchived: false,
    });

    const handleChange = (event) => {
        setState({
            ...state,
            checkedB: false,
            [event.target.name]: event.target.checked,
        });
        if (event.target.name === 'checkedArchived') {
            showArchived();
        }
        showDisabled();
    };

    const onSearchChange = (e) => {
        const newTerm = e.target.value;
        setTerm(newTerm);
        SearchChange(newTerm);
    };

    return (
        <Card additionClassName="search-group">
            {!forLessons && (
                <FormControlLabel
                    control={
                        <Switch
                            checked={state.checkedB}
                            onChange={handleChange}
                            name="checkedB"
                            color="primary"
                        />
                    }
                    label={!state.checkedB ? t('common:show_disabled') : t('common:show_enabled')}
                />
            )}
            {!forLessons && showArchived ? (
                <FormControlLabel
                    control={
                        <Switch
                            checked={state.checkedArchived}
                            onChange={handleChange}
                            name="checkedArchived"
                            color="secondary"
                        />
                    }
                    label={!state.checkedArchived ? t('show_archived') : t('show_regular')}
                />
            ) : null}

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
