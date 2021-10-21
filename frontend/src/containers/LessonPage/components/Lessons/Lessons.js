import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { LESSON_NO_LESSON_FOR_GROUP_LABEL } from '../../../../constants/translationLabels/common';
import { selectLessonCardService } from '../../../../services/lessonService';

import LessonsList from '../LessonsList/LessonsList';

const Lessons = (props) => {
    const { t } = useTranslation('common');
    const { visibleItems, onClickOpen, onCopyLesson, groupId, groups, loading } = props;

    const searchTitleGroupByID = (id) => groups.find((group) => group.id === +id)?.title;

    if (loading) {
        return (
            <section className="centered-container">
                <CircularProgress />
            </section>
        );
    }

    if (!visibleItems.length && groupId) {
        return (
            <section className="centered-container">
                <h2>{t(LESSON_NO_LESSON_FOR_GROUP_LABEL) + searchTitleGroupByID(groupId)}</h2>
            </section>
        );
    }

    return (
        <LessonsList
            lessons={visibleItems}
            onClickOpen={onClickOpen}
            onSelectLesson={selectLessonCardService}
            onCopyLesson={onCopyLesson}
        />
    );
};

const mapStateToProps = (state) => ({
    groupId: state.lesson.groupId,
    groups: state.groups.groups,
    loading: state.loadingIndicator.loading,
});

export default connect(mapStateToProps)(Lessons);
