import React from 'react';
import {isEqual, isNil} from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Card from '../share/Card/Card';

import i18n from '../i18n';
import {EMPTY_SCHEDULE} from '../constants/translationLabels/common';
import LessonTemporaryCardCell from '../containers/GroupSchedulePage/LessonTemporaryCardCell';
import TeacherTemporaryCardCell from '../containers/GroupSchedulePage/TeacherTemporaryCardCell';
import {places} from '../constants/places';
import {getLessonTypeColor} from '../constants/lessonTypeColors';
import './renderScheduleTable.scss';
import {
    checkSemesterEnd,
    isWeekOdd,
    matchDayNumberSystemToDayName,
    printWeekNumber,
    transformSemesterDate
} from "../utils/dateUtils";

const renderClassCell = (classItem) =>
    `${classItem.class_name}\n\r\n\r${classItem.startTime} - ${classItem.endTime}`;

const isClassEmpty = (classItem) => {
    const { cards } = classItem;
    return (
        cards.odd.every((g) => g.card === null) &&
        cards.even.every((g) => g.card === null)
    );
};

/**
 * Pure — no mutation of input array.
 * Replaces the old prepareGroups that mutated card.skip_render.
 */
const prepareGroups = (groups, weekType, isOdd, isCurrentDay) => {
    const skipSet = new Set();

    return groups.map((group, i) => {
        if (skipSet.has(i)) return null;

        const { card } = group;
        let colspan = 1;
        let rowspan = 1;
        let classname = 'lesson';

        if (weekType === isOdd && isCurrentDay) {
            classname += ' currentDay';
        }
        if (card !== null && card.weekly_render === 1) {
            rowspan = 2;
            classname += ' weekly';
        }
        for (let j = i + 1; j < groups.length; j++) {
            const { card: nextCard } = groups[j];
            if (card !== null && nextCard !== null && isEqual(card, nextCard)) {
                skipSet.add(j);
                colspan++;
                classname += ' grouped';
            } else {
                break;
            }
        }

        return { card, classname, rowspan, colspan };
    });
};

// ─── group schedule (simple) ─────────────────────────────────────────────────

export const renderGroupDayClass = (
    classDay,
    isOddWeek,
    semesterDays,
    currentWeekType,
    currentDay,
) => (
    <TableRow key={`${classDay.class.id}-${isOddWeek}`}>
        <TableCell className="lesson groupLabelCell">
            {renderClassCell(classDay.class)}
        </TableCell>
        {classDay.lessons.map(({ day, card }, idx) => {
            let className = 'lesson ';
            if (currentDay === day && currentWeekType === isOddWeek) {
                className += ' currentDay';
            }
            return (
                semesterDays.includes(day) && (
                    <TableCell key={`${day}-${idx}`} className={className}>
                        <LessonTemporaryCardCell card={card} day={day} place={places.TOGETHER}/>
                    </TableCell>
                )
            );
        })}
    </TableRow>
);

export const renderScheduleGroupHeader = (days) => (
    <TableHead>
        <TableRow>
            <TableCell className="groupLabelCell"/>
            {days.map((day) => (
                <TableCell key={day}>{i18n.t(`day_of_week_${day}`)}</TableCell>
            ))}
        </TableRow>
    </TableHead>
);

export const renderGroupTable = (classes, isOdd, semester) => {
    const currentWeekType = isWeekOdd(printWeekNumber(semester.startDay));
    const currentDay = checkSemesterEnd(semester.endDay) ? '' : matchDayNumberSystemToDayName();
    return (
        <TableContainer>
            <Table aria-label="sticky table">
                {semester && renderScheduleGroupHeader(semester.semester_days)}
                <TableBody>
                    {classes.map((classDay, idx) =>
                        classDay ? renderGroupDayClass(
                            classDay,
                            isOdd,
                            semester.semester_days,
                            currentWeekType,
                            currentDay,
                        ) : null
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const LESSON_TYPES = {
    basic: [
        { type: 'lecture',    label: i18n.t('lesson_type_lecture',    'Лекція') },
        { type: 'practical',  label: i18n.t('lesson_type_practical',  'Практична') },
        { type: 'laboratory', label: i18n.t('lesson_type_lab',        'Лабораторна') },
   ],
    exams: [
        { type: 'exam',   label: i18n.t('lesson_type_exam',   'Екзамен') },
        { type: 'credit', label: i18n.t('lesson_type_credit', 'Залік') },
    ],
};

export const ScheduleLegend = ({ variant = 'all' }) => {
    const legendItems = variant === 'all'
        ? [...LESSON_TYPES.basic, ...LESSON_TYPES.exams]
        : LESSON_TYPES[variant] ?? [];

    return (
        <div className="schedule-legend">
            {legendItems.map(({ type, label }) => (
                <span key={type} className="schedule-legend__item">
                    <span
                        className="schedule-legend__dot"
                        style={{ backgroundColor: getLessonTypeColor(type, 'main') }}
                    />
                    {label}
                </span>
            ))}
        </div>
    );
};

const renderTeacherClassCell = (cards, dayName, selectedColor) => {
    let teacherLessonAddCellClass = '';
    if (cards !== undefined && cards.cards.length > 1) {
        cards.cards.forEach((card, cardIndex) => {
            if (cards.cards[cardIndex + 1] && card.room !== cards.cards[cardIndex + 1].room) {
                teacherLessonAddCellClass = 'intersection-on-schedule';
            }
        });
    }
    return (
        <TableCell key={dayName} className={`lesson ${teacherLessonAddCellClass}`}>
            <TeacherTemporaryCardCell cards={cards?.cards} day={dayName} selectedColor={selectedColor} />
        </TableCell>
    );
};

const renderClassRow = (classItem, days, scheduleRow, selectedColor) => (
    <TableRow key={classItem.id}>
        <TableCell className="lesson groupLabelCell">{renderClassCell(classItem)}</TableCell>
        {days.map((dayName) => {
            const cell = scheduleRow?.find((item) => item.day === dayName);
            return renderTeacherClassCell(cell, dayName, selectedColor);
        })}
    </TableRow>
);

export const renderWeekTable = (schedule, selectedColor = null) => {
    const { days, classes, cards } = schedule;
    return (
        <TableContainer>
            <Table aria-label="sticky table">
                {renderScheduleGroupHeader(days)}
                <TableBody>
                    {classes.map((classItem) =>
                        renderClassRow(classItem, days, cards[classItem.id], selectedColor)
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const renderLessonsFirstLine = (lessonItem) => (
    <>
        <TableCell>{lessonItem.lesson.subject_for_site}</TableCell>
        <TableCell>{lessonItem.lesson.group_name}</TableCell>
        <TableCell>{lessonItem.lesson.room.name}</TableCell>
    </>
);

const renderLessonsRestLines = (lessons) => {
    if (lessons.length === 1) return null;

    const hasOverlap = lessons.some((lessonItem, idx) => {
        const next = lessons[idx + 1];
        return next && (
            lessonItem.lesson.subject_for_site !== next.lesson.subject_for_site ||
            lessonItem.lesson.room.id !== next.lesson.room.id
        );
    });
    const lessonClassName = hasOverlap ? 'overlap' : 'groupped';

    return lessons.slice(1).map((lessonItem, idx) => (
        <TableRow className={lessonClassName} key={idx}>
            <TableCell>{lessonItem.lesson.subject_for_site}</TableCell>
            <TableCell>{lessonItem.lesson.group_name}</TableCell>
            <TableCell>{lessonItem.lesson.room.name}</TableCell>
        </TableRow>
    ));
};

const renderFirstLineTable = (classItem) => (
    <TableRow key={`${classItem.class.id}-first`}>
        <TableCell rowSpan={classItem.lessons.length}>
            {`${classItem.class.class_name} ( ${classItem.class.startTime} - ${classItem.class.endTime})`}
        </TableCell>
        {renderLessonsFirstLine(classItem.lessons[0])}
    </TableRow>
);

export const renderTeacherRangeDay = (schedule) => {
    if (!schedule) return null;
    return (
        <TableContainer>
            <Table aria-label="sticky table">
                <TableBody>
                    {schedule.map((classItem, idx) => (
                        <React.Fragment key={idx}>
                            {renderFirstLineTable(classItem)}
                            {renderLessonsRestLines(classItem.lessons)}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export const renderTeacherRangeSchedule = (schedule, viewTeacherScheduleResults) => {
    if (isNil(schedule)) return null;
    if (schedule.length === 0) return i18n.t(EMPTY_SCHEDULE);

    return schedule.map((dayItem, idx) => {
        const startDay = transformSemesterDate(dayItem.date);
        return (
            <Card
                key={idx}
                additionClassName={`${viewTeacherScheduleResults} form-card teacher-schedule-day-card`}
            >
                <h3>{`${dayItem.date} ( ${i18n.t(`day_of_week_${startDay.getDay() + 1}`)} )`}</h3>
                {renderTeacherRangeDay(dayItem.schedule)}
            </Card>
        );
    });
};