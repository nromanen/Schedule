import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import i18n from '../../i18n';
import './DepartmentSchedule.scss';
import {checkSemesterEnd, getWeekParity, isWeekOdd, matchDayNumberSystemToDayName} from "../../utils/dateUtils";


const renderClassCell = (classItem) => {
    return (
        <div className="class-cell">
            <div className="class-name">{classItem.class_name}</div>
            <div className="class-time">{classItem.startTime} - {classItem.endTime}</div>
        </div>
    );
};

const renderLessonCell = (lesson, groupTitles) => {
    if (!lesson) return <span className="empty-cell">-</span>;

    return (
        <div className="lesson-cell">
            <div className="subject">{lesson.subjectForSite}</div>
            <div className="group">{groupTitles.join(', ')}</div>
            <div className="room">
                {lesson.room?.name}
                {lesson.linkToMeeting && (
                    <a
                    href={lesson.linkToMeeting}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meeting-link"
                    title="Перейти до онлайн-заняття"
                    >
                    🔗
                    </a>
                    )}
            </div>
        </div>
    );
};

const getLessonTypeClass = (lesson) =>
    `type-${lesson?.lessonType?.toLowerCase() || 'default'}`;

const isRowEmpty = (cards, teachers) => {
    if (!cards || cards.length === 0) return true;
    return teachers.every(teacher => {
        const lesson = cards.find(c => c.card?.teacher?.id === teacher.id)?.card;
        return !lesson;
    });
};

const getMaxUsedClassIndexForDay = (dayData, teachers) => {
    let maxIndex = -1;
    dayData.classes.forEach((classData, classIndex) => {
        const hasLesson =
            [...(classData.cards.odd || []), ...(classData.cards.even || [])]
                .some(c => teachers.some(t => t.id === c.card?.teacher?.id));
        if (hasLesson && classIndex > maxIndex) {
            maxIndex = classIndex;
        }
    });
    return maxIndex;
};

const DepartmentSchedule = ({fullSchedule, departmentId}) => {
    const {resultArray, semester} = fullSchedule;
    const currentDay = semester?.endDay && !checkSemesterEnd(semester.endDay)
        ? matchDayNumberSystemToDayName()
        : '';
    const currentWeekType = semester?.startDay ? isWeekOdd(getWeekParity(semester.startDay)) : true;

    const teacherSet = new Map();

    resultArray.forEach(dayData => {
        dayData.classes.forEach(classData => {
            ['odd', 'even'].forEach(weekType => {
                const cards = classData.cards[weekType] || [];
                cards.forEach(cardData => {
                    const card = cardData.card;
                    if (card && card.teacher && card.teacher.department?.id === departmentId) {
                        if (!teacherSet.has(card.teacher.id)) {
                            teacherSet.set(card.teacher.id, card.teacher);
                        }
                    }
                });
            });
        });
    });

    const teachers = Array.from(teacherSet.values()).sort((a, b) =>
        a.surname.localeCompare(b.surname, 'uk')
    );

    if (teachers.length === 0) {
        return <p className="empty_schedule">{i18n.t('common:empty_schedule')}</p>;
    }

    const maxClassIndex = Math.max(
        ...resultArray.map(dayData => getMaxUsedClassIndexForDay(dayData, teachers))
    );

    if (maxClassIndex === -1) {
        return <p className="empty_schedule">{i18n.t('common:empty_schedule')}</p>;
    }

    return (
        <TableContainer className="department-schedule">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell className="header-cell day-header"></TableCell>
                        <TableCell className="header-cell class-header" colSpan={2}>{i18n.t('classweek_label')}</TableCell>
                        {teachers.map(teacher => (
                            <TableCell key={teacher.id} className="header-cell teacher-header">
                                {`${teacher.surname} ${teacher.name?.charAt(0) || ''}.${teacher.patronymic?.charAt(0) || ''}.`}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {resultArray.map((dayData, dayIndex) => {
                        // const maxClassIndex = getMaxUsedClassIndexForDay(dayData, teachers);

                        // if (maxClassIndex === -1) return null;

                        const filteredClasses = dayData.classes.filter((_, i) => i <= maxClassIndex);
                        const classCount = filteredClasses.length;

                        return filteredClasses.map((classData, classIndex) => (
                            <React.Fragment key={`${dayData.day}_${classData.class.id}`}>
                                <TableRow
                                    className={`${dayIndex % 2 === 0 ? 'day-even' : 'day-odd'} week-odd ${
                                        isRowEmpty(classData.cards.odd, teachers) ? 'all-free' : ''
                                    } ${dayData.day === currentDay && currentWeekType ? 'currentDay' : ''}`}
                                >
                                    {classIndex === 0 && (
                                        <TableCell rowSpan={classCount * 2} className="day-cell">
                                            <span className="day-cell-text">
        {i18n.t(`common:day_of_week_${dayData.day}`)}
    </span>
                                        </TableCell>
                                    )}
                                    <TableCell rowSpan={2} className="class-cell-wrapper">
                                        {renderClassCell(classData.class)}
                                    </TableCell>
                                    <TableCell className="week-cell">1</TableCell>
                                    {teachers.map(teacher => {
                                        const cards = classData.cards.odd || [];
                                        const matchedCards = cards.filter(c => c.card?.teacher?.id === teacher.id);
                                        const lesson = matchedCards[0]?.card;
                                        const groupTitles = matchedCards.map(c => c.group?.title).filter(Boolean);
                                        return (
                                            <TableCell key={`${teacher.id}_odd`} className={`lesson-cell-wrapper ${getLessonTypeClass(lesson)}`}>
                                                {renderLessonCell(lesson, groupTitles)}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                                <TableRow
                                    className={`${dayIndex % 2 === 0 ? 'day-even' : 'day-odd'} week-even ${
                                        classIndex === classCount - 1 ? 'day-last' : 'class-last'
                                    } ${
                                        isRowEmpty(classData.cards.even, teachers) ? 'all-free' : ''
                                    } ${dayData.day === currentDay && !currentWeekType ? 'currentDay' : ''}`}
                                >
                                    <TableCell className="week-cell">2</TableCell>
                                    {teachers.map(teacher => {
                                        const cards = classData.cards.even || [];
                                        const matchedCards = cards.filter(c => c.card?.teacher?.id === teacher.id);
                                        const lesson = matchedCards[0]?.card;
                                        const groupTitles = matchedCards.map(c => c.group?.title).filter(Boolean);
                                        return (
                                            <TableCell key={`${teacher.id}_even`} className={`lesson-cell-wrapper ${getLessonTypeClass(lesson)}`}>
                                                {renderLessonCell(lesson, groupTitles)}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </React.Fragment>
                        ));
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DepartmentSchedule;