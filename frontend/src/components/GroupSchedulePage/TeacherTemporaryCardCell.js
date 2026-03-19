import { isNil } from 'lodash';
import React from 'react';
import { COMMON_REGULAR_LESSON_LABEL, COMMON_VACATION_LABEL } from '../../constants/translationLabels/common';
import {
    buildLessonWithRoom,
    prepareTeacherCardRegularCell,
    prepareTitleAndInner,
} from '../../helper/prepareTeacherCell';
import { setLink } from '../../helper/setLInk';
import i18n from '../../i18n';
import { getLessonTypeColor } from '../../constants/lessonTypeColors';
import { places } from '../../constants/places';

const TeacherTemporaryCardCell = (props) => {
    const { cards, place } = props;
    if (!cards) {
        return '';
    }

    if (cards.length === 1) {
        if (isNil(cards[0])) {
            return '';
        }

        const card = cards[0];
        const { temporary_schedule: tempSchedule, linkToMeeting } = card;
        const meetingLink = linkToMeeting && setLink(card, place);
        const barColor = getLessonTypeColor(card.lessonType);

        if (tempSchedule) {
            const { date, room, vacation, subjectForSite } = tempSchedule;
            const roomLabel = room ? `, ${room.name}` : '';
            let inner = `${date}\n\r`;
            inner += vacation
                ? `${i18n.t(COMMON_VACATION_LABEL)}`
                : `${subjectForSite}${roomLabel}`;

            const title = `${i18n.t(COMMON_REGULAR_LESSON_LABEL)}\r${prepareTeacherCardRegularCell(card, place)}`;

            return (
                <>
                    <div
                        className="lesson-type-bar"
                        style={{ backgroundColor: barColor }}
                    />
                    <p className="temporary-class" title={title}>
                        {inner}
                        {meetingLink}
                    </p>
                </>
            );
        }

        // Regular single lesson
        const lessonTypeLabel = i18n.t(`formElements:lesson_type_${card.lessonType?.toLowerCase()}_label`);
        const roomStr = place !== places.ONLINE && card.room ? `, ${card.room}` : '';

        return (
            <div
                className="lesson-cell-wrapper"
                style={{ borderLeft: `4px solid ${card.semesterColor ?? 'transparent'}` }}
            >
                <div className="lesson-type-bar" style={{ backgroundColor: barColor }} />
                <p className="lesson-subject">{card.subjectForSite}</p>
                <p className="lesson-details">({lessonTypeLabel}{roomStr})</p>
                <p className="lesson-teacher">{card.group?.title}</p>
                {meetingLink}
            </div>
        );
    }

    // Multiple cards (grouped lesson for multiple groups)
    const card = cards[0];
    const barColor = getLessonTypeColor(card.lessonType);
    const hasTemp = cards.some(c => c.temporary_schedule);

    // If any card has temporary schedule, use old text-based rendering
    if (hasTemp) {
        let inner = '';
        let title = '';
        inner += buildLessonWithRoom(card, place);

        const { title: resTitle, inner: resInner } = prepareTitleAndInner({
            title,
            inner,
            cards,
            place,
        });
        return (
            <>
                <div
                    className="lesson-type-bar"
                    style={{ backgroundColor: barColor }}
                />
                <p className="temporary-class" title={resTitle}>
                    {resInner}
                    {card.linkToMeeting && setLink(card, place)}
                </p>
            </>
        );
    }

    // Regular grouped lesson - structured JSX
    const lessonTypeLabel = i18n.t(`formElements:lesson_type_${card.lessonType?.toLowerCase()}_label`);
    const roomStr = place !== places.ONLINE && card.room ? `, ${card.room}` : '';
    const groupTitles = cards.map(c => c.group?.title).filter(Boolean);
    const meetingLink = card.linkToMeeting && setLink(card, place);

    return (
        <div
            className="lesson-cell-wrapper grouped-lesson"
            style={{ borderLeft: `4px solid ${card.semesterColor ?? 'transparent'}` }}
        >
            <div className="lesson-type-bar" style={{ backgroundColor: barColor }} />
            <p className="lesson-subject">{card.subjectForSite}</p>
            <p className="lesson-details">({lessonTypeLabel}{roomStr})</p>
            <p className="lesson-teacher">{groupTitles.join(', ')}</p>
            {meetingLink}
        </div>
    );
};

export default TeacherTemporaryCardCell;