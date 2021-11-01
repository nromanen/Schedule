import React, { useState } from 'react';
import i18n from 'i18next';
import Card from '@material-ui/core/Card';
import {
    FORM_GROUPED_LABEL,
    FORM_HOURS_LABEL,
} from '../../constants/translationLabels/formElements';
import './DragDropCard.scss';
import { getTeacherName } from '../../helper/renderTeacher';

const DragDropCard = (props) => {
    const { setDragItemData, lesson } = props;

    const onDragStart = () => {
        setDragItemData(lesson);
    };
    return (
        <Card className="draggable-card schedule-item" draggable onDragStart={onDragStart}>
            <h5 className="lesson-title">
                {lesson.subjectForSite} (
                {i18n.t(`formElements:lesson_type_${lesson.lessonType.toLowerCase()}_label`)})
            </h5>
            <p className="teacher-name">{getTeacherName(lesson.teacher)}</p>

            <p className="lesson-duration">
                {/* {isGroupped(lesson.grouped)} */}
                <b>1</b> {i18n.t(FORM_HOURS_LABEL)}
            </p>
        </Card>
    );
};
export default DragDropCard;
