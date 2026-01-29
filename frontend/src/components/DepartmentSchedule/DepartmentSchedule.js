import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import {
    checkSemesterEnd,
    matchDayNumberSysytemToDayName,
    getWeekParity,
    isWeekOdd
} from '../../helper/renderScheduleTable';

import i18n from '../../i18n';
import './DepartmentSchedule.scss';


const renderClassCell = (classItem) => {
    return (
        <div className="class-cell">
            <div className="class-name">{classItem.class_name}</div>
            <div className="class-time">{classItem.startTime} - {classItem.endTime}</div>
        </div>
    );
};

const renderLessonCell = (lesson) => {
    if (!lesson) return <span className="empty-cell">-</span>;

    return (
        <div className="lesson-cell">
            <div className="subject">{lesson.subject_for_site}</div>
            <div className="group">{lesson.group_name}</div>
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

const isRowEmpty = (cards, teachers) => {
    if (!cards || cards.length === 0) return true;
    return teachers.every(teacher => {
        const lesson = cards.find(c => c.card?.teacher?.id === teacher.id)?.card;
        return !lesson;
    });
};

const DepartmentSchedule = ({fullSchedule, departmentId}) => {
    const {resultArray, semester} = fullSchedule;
    const currentDay = semester?.endDay && !checkSemesterEnd(semester.endDay)
        ? matchDayNumberSysytemToDayName()
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

    return (
        <TableContainer className="department-schedule">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell className="header-cell day-header">{i18n.t('common:day_label')}</TableCell>
                        <TableCell className="header-cell class-header">{i18n.t('common:class_label')}</TableCell>
                        <TableCell className="header-cell week-header">{i18n.t('common:week_label')}</TableCell>
                        {teachers.map(teacher => (
                            <TableCell key={teacher.id} className="header-cell teacher-header">
                                {`${teacher.surname} ${teacher.name?.charAt(0) || ''}.${teacher.patronymic?.charAt(0) || ''}.`}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {resultArray.map((dayData, dayIndex) => {
                        const classCount = dayData.classes.length;

                        return dayData.classes.map((classData, classIndex) => (
                            <React.Fragment key={`${dayData.day}_${classData.class.id}`}>
                                {/* Odd week row */}
                                <TableRow
                                    className={`${dayIndex % 2 === 0 ? 'day-even' : 'day-odd'} week-odd ${
                                        isRowEmpty(classData.cards.odd, teachers) ? 'all-free' : ''
                                    } ${dayData.day === currentDay && currentWeekType ? 'currentDay' : ''}`}
                                >
                                    {classIndex === 0 && (
                                        <TableCell
                                            rowSpan={classCount * 2}
                                            className="day-cell"
                                        >
                                            {i18n.t(`common:day_of_week_${dayData.day}`)}
                                        </TableCell>
                                    )}
                                    <TableCell rowSpan={2} className="class-cell-wrapper">
                                        {renderClassCell(classData.class)}
                                    </TableCell>
                                    <TableCell className="week-cell">1</TableCell>
                                    {teachers.map(teacher => {
                                        const cards = classData.cards.odd || [];
                                        const lesson = cards.find(c => c.card?.teacher?.id === teacher.id)?.card;
                                        return (
                                            <TableCell key={`${teacher.id}_odd`} className="lesson-cell-wrapper">
                                                {renderLessonCell(lesson)}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                                {/* Even week row */}
                                <TableRow
                                    className={`${dayIndex % 2 === 0 ? 'day-even' : 'day-odd'} week-even ${classIndex === classCount - 1 ? 'day-last' : 'class-last'} ${
                                        isRowEmpty(classData.cards.even, teachers) ? 'all-free' : ''
                                    } ${dayData.day === currentDay && !currentWeekType ? 'currentDay' : ''}`}
                                >
                                    <TableCell className="week-cell">2</TableCell>
                                    {teachers.map(teacher => {
                                        const cards = classData.cards.even || [];
                                        const lesson = cards.find(c => c.card?.teacher?.id === teacher.id)?.card;
                                        return (
                                            <TableCell key={`${teacher.id}_even`} className="lesson-cell-wrapper">
                                                {renderLessonCell(lesson)}
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