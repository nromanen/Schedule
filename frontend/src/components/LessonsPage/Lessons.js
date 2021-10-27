import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LESSON_NO_LESSON_FOR_GROUP_LABEL } from '../../constants/translationLabels/common';

import LessonsList from './LessonsList/LessonsList';

const Lessons = (props) => {
    const { t } = useTranslation('common');
    const {
        visibleItems,
        onClickOpen,
        onCopyLesson,
        groupId,
        groups,
        loading,
        selectLessonCardOf,
    } = props;

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
            onSelectLesson={selectLessonCardOf}
            onCopyLesson={onCopyLesson}
        />
    );
};

export default Lessons;
