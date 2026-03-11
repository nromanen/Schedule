import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import i18n from '../../i18n';
import LessonTemporaryCardCell from '../../containers/GroupSchedulePage/LessonTemporaryCardCell';
import { places } from '../../constants/places';
import { daysUppercase } from '../../constants/schedule/days';
import { FORM_GROUP_LABEL } from '../../constants/translationLabels/formElements';

import './CalendarSchedule.scss';
import {getWeekParity, isWeekOdd} from "../../utils/weekUtils";

const shortid = require('shortid');

// ─── Date helpers ───────────────────────────────────────────────

const parseSemesterDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(+year, +month - 1, +day);
};

const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}.${mm}`;
};

const getDayName = (date) => {
    const jsDay = date.getDay();
    return jsDay === 0 ? daysUppercase[6] : daysUppercase[jsDay - 1];
};

const generateCalendarDays = (startDay, endDay) => {
    const start = parseSemesterDate(startDay);
    const end = parseSemesterDate(endDay);
    const days = [];

    const current = new Date(start);
    while (current <= end) {
        days.push({
            date: new Date(current),
            dateFormatted: formatDate(current),
            dayName: getDayName(current),
        });
        current.setDate(current.getDate() + 1);
    }
    return days;
};

export const isShortSemester = (startDay, endDay) => {
    const start = parseSemesterDate(startDay);
    const end = parseSemesterDate(endDay);
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return diffDays <= 28;
};

// ─── Helpers ────────────────────────────────────────────────────

const isDayEmpty = (dayName, isOdd, resultArray) => {
    const dayData = resultArray.find(d => d.day === dayName);
    if (!dayData) return true;
    return dayData.classes.every(classItem => {
        const cards = isOdd ? classItem.cards.odd : classItem.cards.even;
        return cards.every(g => g.card === null);
    });
};

const renderClassCell = (classItem) => {
    return `${classItem.class_name}\n\r\n\r${classItem.startTime} - ${classItem.endTime}`;
};

// ─── Sub-components ─────────────────────────────────────────────

const CalendarScheduleHeader = ({ groupList }) => (
    <TableHead>
        <TableRow>
            <TableCell colSpan={2}>{i18n.t(FORM_GROUP_LABEL)}</TableCell>
            {groupList.map(({ title }) => (
                <TableCell key={shortid.generate()} className="groupLabelCell">
                    {title}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

const CalendarGroupCells = ({ groups, dayName }) => {
    return groups.map((group, groupIndex) => {
        const { card } = group;
        let colspan = 1;
        let classname = 'lesson';

        if (card !== null && card.skip_render === 1) return null;

        for (let i = groupIndex + 1; i < groups.length; i += 1) {
            const { card: tempCard } = groups[i];
            if (
                card !== null &&
                tempCard !== null &&
                card.subject?.id === tempCard.subject?.id &&
                card.teacher?.id === tempCard.teacher?.id &&
                card.room?.id === tempCard.room?.id &&
                card.lessonType === tempCard.lessonType
            ) {
                tempCard.skip_render = 1;
                colspan += 1;
                classname += ' grouped';
            } else {
                break;
            }
        }

        return (
            <TableCell key={shortid.generate()} colSpan={colspan} className={classname}>
                <LessonTemporaryCardCell card={card} day={dayName} place={places.TOGETHER} />
            </TableCell>
        );
    });
};

const CalendarDayRows = ({ calendarDay, dayData, isOdd }) => {
    if (!dayData) return null;

    const nonEmptyClasses = dayData.classes.filter(classItem => {
        const cards = isOdd ? classItem.cards.odd : classItem.cards.even;
        return !cards.every(g => g.card === null);
    });

    if (nonEmptyClasses.length === 0) return null;

    return nonEmptyClasses.map((classItem, classIndex) => {
        const cards = isOdd ? classItem.cards.odd : classItem.cards.even;
        cards.forEach(g => { if (g.card) g.card.skip_render = 0; });

        return (
            <TableRow key={shortid.generate()} className={classIndex === 0 ? 'calendar-day-first-row' : ''}>
                {classIndex === 0 && (
                    <TableCell rowSpan={nonEmptyClasses.length} className="calendar-day-cell">
                        <span className="calendar-day-name">
                            {i18n.t(`common:day_of_week_short_${calendarDay.dayName}`)}
                        </span>
                        <span className="calendar-day-date">
                            {calendarDay.dateFormatted}
                        </span>
                    </TableCell>
                )}
                <TableCell className="classNameCell calendar-class-cell">
                    <span className="calendar-class-name">{classItem.class.class_name}</span>
                    <span className="calendar-class-time">{classItem.class.startTime} - {classItem.class.endTime}</span>
                </TableCell>
                <CalendarGroupCells groups={cards} dayName={calendarDay.dayName} />
            </TableRow>
        );
    });
};

// ─── Main component (TABLE ONLY) ────────────────────────────────

const CalendarSchedule = ({ fullSchedule, viewMode, t }) => {
    const { semester, groupList, resultArray } = fullSchedule;
    const { startDay, endDay } = semester;

    const allCalendarDays = generateCalendarDays(startDay, endDay);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayFormatted = formatDate(today);

    const calendarDays = viewMode === 'today'
        ? allCalendarDays.filter(d => d.dateFormatted === todayFormatted)
        : allCalendarDays;

    const nonEmptyDays = calendarDays.filter(calendarDay => {
        const isOdd = isWeekOdd(getWeekParity(startDay, calendarDay.date));
        return !isDayEmpty(calendarDay.dayName, isOdd, resultArray);
    });

    if (nonEmptyDays.length === 0) {
        return (
            <p className="empty_schedule">
                {viewMode === 'today'
                    ? t('common:no_classes_today', 'Сьогодні немає занять')
                    : t('common:empty_schedule')
                }
            </p>
        );
    }

    return (
        <TableContainer>
            <Table aria-label="calendar schedule">
                <CalendarScheduleHeader groupList={groupList} />
                <TableBody>
                    {nonEmptyDays.map(calendarDay => {
                        const isOdd = isWeekOdd(getWeekParity(startDay, calendarDay.date));
                        const dayData = resultArray.find(d => d.day === calendarDay.dayName);
                        return (
                            <CalendarDayRows
                                key={calendarDay.dateFormatted}
                                calendarDay={calendarDay}
                                dayData={dayData}
                                isOdd={isOdd}
                            />
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CalendarSchedule;