import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LESSON_NO_LESSON_FOR_GROUP_LABEL } from '../../constants/translationLabels/common';

import LessonsList from './LessonsList/LessonsList';
import './LessonPage.scss';

const Lessons = (props) => {
    const { t } = useTranslation('common');
    const { visibleItems, onClickOpen, onCopyLesson, groupId, group, loading, selectLessonCardOf } =
        props;

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
                <h2>{t(LESSON_NO_LESSON_FOR_GROUP_LABEL) + group.title}</h2>
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
