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
import LessonTypeBadge from "../LessonTypeBadge/LessonTypeBadge";

const TeacherTemporaryCardCell = (props) => {
    const { cards, place } = props;
    if (!cards) {
        return '';
    }

    const getLessonTypeLabel = (lessonType) =>
        i18n.t(`formElements:lesson_type_${lessonType?.toLowerCase()}_label`);
    const getRoomStr = (room, place) =>
        place !== places.ONLINE && room ? (room.name || room) : '';

    const renderLeftBar = (card) => {
        const hasSemesterColor = !!card.semesterColor;
        if (hasSemesterColor) return null;
        return (
            <div
                className="lesson-type-bar"
                style={{ backgroundColor: getLessonTypeColor(card.lessonType) }}
            />
        );
    };

    const getBorderLeft = (card) => {
        return card.semesterColor
            ? `4px solid ${card.semesterColor}`
            : '4px dashed transparent';
    };

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

        return (
            <div
                className="lesson-cell-wrapper"
                style={{ borderLeft: getBorderLeft(card) }}
            >
                {renderLeftBar(card)}
                <p className="lesson-subject">{card.subjectForSite}</p>
                <LessonTypeBadge lessonType={card.lessonType} showIcon={false} size="small" />
                <p className="lesson-details">
                    {getRoomStr(card.room, place)}
                    <span>{meetingLink}</span>
                </p>
                <p className="lesson-teacher">{card.group?.title}</p>
            </div>
        );
    }

    const card = cards[0];
    const barColor = getLessonTypeColor(card.lessonType);
    const hasTemp = cards.some(c => c.temporary_schedule);

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

    const groupTitles = cards.map(c => c.group?.title).filter(Boolean);
    const meetingLink = card.linkToMeeting && setLink(card, place);

    return (
        <div
            className="lesson-cell-wrapper grouped-lesson"
            style={{ borderLeft: getBorderLeft(card) }}
        >
            {renderLeftBar(card)}
            <p className="lesson-subject">{card.subjectForSite}</p>
            <LessonTypeBadge lessonType={card.lessonType} showIcon={false} size="small" />
            <p className="lesson-details">
                {[...new Set(cards.map(c => getRoomStr(c.room, place)).filter(Boolean))].join(', ')}
                <span>{meetingLink}</span>
            </p>
            <p className="lesson-teacher">{groupTitles.join(', ')}</p>
        </div>
    );
};

export default TeacherTemporaryCardCell;