import React from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';

import { LESSON_FOR_GROUP_TITLE } from '../../../constants/translationLabels/common';
import { FORM_GROUP_LABEL } from '../../../constants/translationLabels/formElements';
import SearchPanel from '../../../share/SearchPanel/SearchPanel';
import { selectGroupService } from '../../../services/groupService';
import '../LessonPage.scss';
import './Search.scss';

const Search = (props) => {
    const { setTerm, groups, selectByGroupId, group } = props;
    const { t } = useTranslation();

    const handleGroupSelect = (selGroup) => {
        if (selGroup) {
            selectByGroupId(selGroup.id);
            selectGroupService(selGroup.id);
        }
    };

    return (
        <div className="search-container">
            <div className="lesson-page-title">
                <aside className="search-lesson-group">
                    {group.id && (
                        <div className="search-lesson">
                            <SearchPanel forLessons SearchChange={setTerm} />
                        </div>
                    )}
                    <div className="group-lesson">
                        {/* <h1 className="lesson-page-h">{t(LESSON_FOR_GROUP_TITLE)}</h1> */}
                        <Autocomplete
                            id="group"
                            value={group}
                            options={groups}
                            clearOnEscape
                            openOnFocus
                            getOptionLabel={(option) => option.title}
                            onChange={(_, newValue) => {
                                handleGroupSelect(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    className="textField"
                                    {...params}
                                    label={t(FORM_GROUP_LABEL)}
                                    margin="normal"
                                />
                            )}
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Search;
