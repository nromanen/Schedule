import React from 'react';
import { connect } from 'react-redux';
import { styled } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { LESSON_FOR_GROUP_TITLE } from '../../../../constants/translationLabels/common';
import { FORM_GROUP_LABEL } from '../../../../constants/translationLabels/formElements';
import SearchPanel from '../../../../share/SearchPanel/SearchPanel';
import { selectGroupService } from '../../../../services/groupService';
import { selectGroupIdService } from '../../../../services/lessonService';
import '../../LessonPage.scss';

const GroupField = styled(TextField)({
    display: 'inline-block',
    width: '150px',
});

const Search = (props) => {
    const { groupId, setTerm, groups } = props;
    const { t } = useTranslation();

    const handleGroupSelect = (group) => {
        if (group) {
            selectGroupIdService(group.id);
            selectGroupService(group.id);
        }
    };

    return (
        <div className="lesson-page-title">
            <aside className="search-lesson-group">
                {groupId && (
                    <span className="search-lesson">
                        <SearchPanel forLessons SearchChange={setTerm} />
                    </span>
                )}
                <span className="group-lesson">
                    <h1 className="lesson-page-h">{t(LESSON_FOR_GROUP_TITLE)}</h1>
                    <Autocomplete
                        id="group"
                        clearOnEscape
                        openOnFocus
                        options={groups}
                        getOptionLabel={(option) => option.title}
                        onChange={(event, newValue) => {
                            handleGroupSelect(newValue);
                        }}
                        renderInput={(params) => (
                            <GroupField {...params} label={t(FORM_GROUP_LABEL)} margin="normal" />
                        )}
                    />
                </span>
            </aside>
        </div>
    );
};

const mapStateToProps = (state) => ({
    groupId: state.lesson.groupId,
    groups: state.groups.groups,
});

export default connect(mapStateToProps)(Search);
