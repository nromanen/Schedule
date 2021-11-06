import React from 'react';
import Card from '@material-ui/core/Card';
import { MdGroup } from 'react-icons/md';
import {
    FORM_GROUPED_LABEL,
    FORM_HOURS_LABEL,
} from '../../constants/translationLabels/formElements';
import { getTeacherName } from '../../helper/renderTeacher';
import './ScheduleLessonList/ScheduleLessonList.scss';
import i18n from '../../i18n';

const DragDropCard = (props) => {
    const { setDragItemData, lesson } = props;

    const onDragStart = () => {
        setDragItemData(lesson);
    };
    return (
        <div className="board-container">
            <Card className="draggable-card schedule-item card" draggable onDragStart={onDragStart}>
                <h5 className="lesson-title">
                    {lesson.subjectForSite} (
                    {i18n.t(`formElements:lesson_type_${lesson.lessonType.toLowerCase()}_label`)})
                </h5>
                <p className="teacher-name">{getTeacherName(lesson.teacher)}</p>
                {lesson.grouped && (
                    <span className="grouped-icon">
                        <MdGroup
                            title={i18n.t(FORM_GROUPED_LABEL)}
                            className="svg-btn copy-btn align-left info-btn"
                        />
                    </span>
                )}
                <p className="lesson-duration">
                    <b>1</b> {i18n.t(FORM_HOURS_LABEL)}
                </p>
            </Card>
        </div>
    );
};
export default DragDropCard;
