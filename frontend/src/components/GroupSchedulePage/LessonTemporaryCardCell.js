import React from 'react';
import { isNil } from 'lodash';
import { COMMON_REGULAR_LESSON_LABEL, COMMON_VACATION_LABEL } from '../../constants/translationLabels/common';
import { getTeacherForSite, getTeacherWithShortPosition } from '../../helper/renderTeacher';
import { setLink } from '../../helper/setLInk';
import i18n from '../../i18n';
import { prepareLessonCardCell, prepareLessonSubCardCell } from '../../helper/prepareLessonCell';
import { places } from '../../constants/places';
import './GroupSchedulePage.scss';

const lessonTypeColors = {
    lecture: '#689F38',
    laboratory: '#1976D2',
    practical: '#F9A825',
    seminar: '#8E24AA',
};

const LessonTemporaryCardCell = (props) => {
    const { card, place, day } = props;
    if (isNil(card)) return '';

    const isOnline = !isNil(card.linkToMeeting);

    if (place === places.ONLINE && !isOnline) {
        return '';
    }
    if (place === places.AUDITORY && isOnline) {
        return '';
    }

    const { temporary_schedule: tempSchedule, linkToMeeting } = card;
    const meetingLink = linkToMeeting && setLink(card, place);
    const triangleColor = lessonTypeColors[card.lessonType?.toLowerCase()] || '#757575';

    if (tempSchedule) {
        const { vacation, date, subjectForSite, room } = tempSchedule;
        const roomLabel = room ? `, ${room.name}` : '';
        let inner = `${date}\n\r`;

        inner += vacation
            ? `${i18n.t(COMMON_VACATION_LABEL)}`
            : `${getTeacherForSite(tempSchedule)}\n${subjectForSite}${roomLabel}`;

        const title = `${i18n.t(COMMON_REGULAR_LESSON_LABEL)}\r${prepareLessonCardCell(
            card,
        )}\r${prepareLessonSubCardCell(card, place)}\r`;

        return (
            <>
                <p className="temporary-class" title={title}>
                    {inner}
                </p>
                {meetingLink}
            </>
        );
    }

    return (
        <div className="lesson-cell-wrapper">
            <div
                className="lesson-type-triangle"
                style={{ borderTopColor: triangleColor }}
            />
            <p className="lesson-teacher" title={i18n.t(`common:day_of_week_${day}`)}>
                {getTeacherWithShortPosition(card.teacher)}
            </p>
            <p className="lesson-subject">
                {card.subjectForSite}
            </p>
            <p className="lesson-details">
                {prepareLessonSubCardCell(card, place)}
            </p>
            {meetingLink}
        </div>
    );
};

export default LessonTemporaryCardCell;