import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import './SearchPanel.scss';
import Card from '../../share/Card/Card';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const SearchPanel = ({ SearchChange, showDisabled, showArchived, forLessons }) => {

    const { t } = useTranslation('formElements');
    const [term, setTerm] = useState('');

    const [state, setState] = React.useState({
        checkedB: false,
        checkedArchived: false
    });

    const handleChange = event => {
        switch (event.target.name) {
            case 'checkedArchived':
                setState({
                    ...state,
                    checkedB: false,
                    [event.target.name]: event.target.checked
                });
                showArchived();
                break;
            default:
                setState({
                    ...state,
                    checkedArchived: false,
                    [event.target.name]: event.target.checked
                });

                break;
        }
        showDisabled();

    };

    const onSearchChange = e => {
        const term = e.target.value;
        setTerm(term);
        SearchChange(term);
    };

    return (
        <Card class='search-group'>
            {!forLessons && <FormControlLabel
                control={
                    <Switch
                        checked={state.checkedB}
                        onChange={handleChange}
                        name='checkedB'
                        color='primary'
                    />
                }
                label={
                    !state.checkedB
                        ? t('common:show_disabled')
                        : t('common:show_enabled')
                }
            />}
            {!forLessons && showArchived ? (
                <FormControlLabel
                    control={
                        <Switch
                            checked={state.checkedArchived}
                            onChange={handleChange}
                            name='checkedArchived'
                            color='secondary'
                        />
                    }
                    label={
                        !state.checkedArchived
                            ? t('show_archived')
                            : t('show_regular')
                    }
                />
            ) : (
                ''
            )}

            <TextField
                className='form-field'
                label={<FaSearch />}
                placeholder={t('type_to_search')}
                value={term}
                onChange={onSearchChange}
            />
        </Card>
    );
};

export default SearchPanel;
