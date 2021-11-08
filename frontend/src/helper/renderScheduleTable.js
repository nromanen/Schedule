import React from 'react';
import { isEqual } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Card from '../share/Card/Card';

import i18n from '../i18n';

import {
    daysUppercase,
    numberOfDaysInAWeek,
    numberOfMilisecondsInADay,
} from '../constants/schedule/days';
import './renderScheduleTable.scss';
import { GROUP_Y_LABEL, FORM_GROUP_LABEL } from '../constants/translationLabels/formElements';
import { EMPTY_SCHEDULE } from '../constants/translationLabels/common';
import LessonTemporaryCardCell from '../containers/GroupSchedulePage/LessonTemporaryCardCell';
import TeacherTemporaryCardCell from '../containers/GroupSchedulePage/TeacherTemporaryCardCell';

const shortid = require('shortid');

const matchDayNumberSysytemToDayName = () => {
    const now = new Date();
    return daysUppercase[now.getDay() - 1];
};
const currentDay = matchDayNumberSysytemToDayName();

const getWeekNumber = (startScheduleDate, date) => {
    const [day, month, year] = startScheduleDate.split('/');
    const startDateString = `${month}/${day}/${year}`;

    const startDay = new Date(startDateString);

    const numberOfDays = Math.floor((date - startDay) / numberOfMilisecondsInADay);
    return Math.ceil((date.getDay() + 1 + numberOfDays) / numberOfDaysInAWeek);
};

const printWeekNumber = (startScheduleDate) => {
    const date = new Date();
    return getWeekNumber(startScheduleDate, date);
};

function isWeekOdd(num) {
    return num % 2 === 1;
}

let currentWeekType = false;

const renderClassCell = (classItem) => {
    return `${classItem.class_name}\n\r\n\r${classItem.startTime} - ${classItem.endTime}`;
};

export const renderGroupDayClass = (classDay, isOddWeek, semesterDays) => {
    return (
        <TableRow key={shortid.generate()}>
            <TableCell className=" lesson groupLabelCell">
                {renderClassCell(classDay.class)}
            </TableCell>
            {classDay.lessons.map(({ day, card }) => {
                let className = 'lesson ';
                if (currentDay === day) {
                    if (currentWeekType === isOddWeek) {
                        className += ' currentDay';
                    }
                }
                return (
                    semesterDays.includes(day) && (
                        <TableCell key={shortid.generate()} className={className}>
                            <LessonTemporaryCardCell card={card} day={day} />
                        </TableCell>
                    )
                );
            })}
        </TableRow>
    );
};

export const renderScheduleGroupHeader = (days) => (
    <TableHead>
        <TableRow>
            <TableCell className="groupLabelCell"></TableCell>
            {days.map((day) => (
                <TableCell key={shortid.generate()}>{i18n.t(`day_of_week_${day}`)}</TableCell>
            ))}
        </TableRow>
    </TableHead>
);

export const renderGroupTable = (classes, isOdd, semester) => {
    if (semester) {
        currentWeekType = isWeekOdd(printWeekNumber(semester.startDay));
    }
    return (
        <TableContainer>
            <Table aria-label="sticky table">
                {semester && renderScheduleGroupHeader(semester.semester_days)}
                <TableBody>
                    {classes.map((classDay) => {
                        if (classDay) {
                            return renderGroupDayClass(classDay, isOdd, semester.semester_days);
                        }
                        return null;
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export const renderGroupCells = (groups, isOdd, weekType, isCurrentDay, dayName) => {
    const prepareGroups = (groupsArray) => {
        // TODO map => reduce
        return groupsArray.map((group, groupIndex) => {
            const { card } = group;
            let colspan = 1;
            let rowspan = 1;
            let classname = 'lesson';

            if (weekType === isOdd && isCurrentDay) {
                classname += ' currentDay';
            }
            if (card !== null && card.skip_render === 1) {
                return null;
            }
            if (card !== null && card.weekly_render === 1) {
                rowspan = 2;
                classname += ' weekly';
            }
            for (let i = groupIndex + 1; i < groups.length; i += 1) {
                const { card: tempCard } = groups[i];
                if (
                    group &&
                    card !== null &&
                    groups[i] &&
                    tempCard !== null &&
                    isEqual(card, tempCard)
                ) {
                    tempCard.skip_render = 1;
                    colspan += 1;
                    classname += ' grouped';
                }
            }
            return { card, classname, rowspan, colspan };
        });
    };
    const resultGroups = prepareGroups(groups);
    return resultGroups.map((group) => {
        if (!group) return null;
        const { card, colspan, rowspan, classname } = group;
        return (
            <TableCell
                key={shortid.generate()}
                colSpan={colspan}
                rowSpan={rowspan}
                className={classname}
            >
                <LessonTemporaryCardCell card={card} day={dayName} />
            </TableCell>
        );
    });
};

export const renderScheduleHeader = (groups) => (
    <TableHead>
        <TableRow>
            <TableCell className="groupLabelCell" colSpan={3}>
                {i18n.t(GROUP_Y_LABEL)}
            </TableCell>
            {groups.map((group) => (
                <TableCell key={shortid.generate()}>{group}</TableCell>
            ))}
        </TableRow>
    </TableHead>
);

export const renderFirstDayFirstClassFirstCardLine = (dayName, classItem, groups, classesCount) => {
    let dayClassName = 'dayNameCell ';
    const classClassName = 'classNameCell ';
    const isCurrentDay = dayName === currentDay;

    let oddWeekClass = '';
    let evenWeekClass = '';
    if (currentDay === dayName) {
        dayClassName += ' currentDay';

        if (currentWeekType) {
            oddWeekClass = ' currentDay';
        } else {
            evenWeekClass = ' currentDay';
        }
    }

    if (groups.even.length <= 2 || groups.odd.length <= 2) {
        dayClassName += ' minHeightDouble';
    }

    return (
        <React.Fragment key={shortid.generate()}>
            <TableRow>
                <TableCell rowSpan={classesCount * 2} className={dayClassName}>
                    <span className="dayName">
                        <b>{i18n.t(`common:day_of_week_${dayName}`)}</b>
                    </span>
                </TableCell>
                <TableCell className={classClassName} rowSpan={2}>
                    {renderClassCell(classItem)}
                </TableCell>
                <TableCell className={`${classClassName + oddWeekClass} subClassName`}>1</TableCell>
                {renderGroupCells(groups.odd, false, currentWeekType, isCurrentDay, dayName)}
            </TableRow>
            <TableRow>
                <TableCell className={`${classClassName + evenWeekClass} subClassName`}>
                    2
                </TableCell>
                {renderGroupCells(groups.even, false, currentWeekType, isCurrentDay, dayName)}
            </TableRow>
        </React.Fragment>
    );
};

export const renderFirstDayOtherClassFirstCardLine = (dayName, classItem, groups) => {
    const classClassName = 'classNameCell ';
    const isCurrentDay = dayName === currentDay;
    let oddWeekClass = '';
    let evenWeekClass = '';

    if (currentDay === dayName) {
        if (currentWeekType) {
            oddWeekClass = ' currentDay';
        } else {
            evenWeekClass = ' currentDay';
        }
    }

    return (
        <React.Fragment key={shortid.generate()}>
            <TableRow>
                <TableCell className={classClassName} rowSpan={2}>
                    {renderClassCell(classItem)}
                </TableCell>
                <TableCell className={`${classClassName + oddWeekClass} subClassName`}>1</TableCell>
                {renderGroupCells(groups.odd, true, currentWeekType, isCurrentDay, dayName)}
            </TableRow>
            <TableRow>
                <TableCell className={`${classClassName + evenWeekClass} subClassName`}>
                    2
                </TableCell>
                {renderGroupCells(groups.even, false, currentWeekType, isCurrentDay, dayName)}
            </TableRow>
        </React.Fragment>
    );
};

export const renderDay = (dayName, dayItem, semesterClassesCount) => {
    return dayItem.map((classItem, classIndex) => {
        if (classIndex === 0) {
            return renderFirstDayFirstClassFirstCardLine(
                dayName,
                classItem.class,
                classItem.cards,
                semesterClassesCount,
            );
        }
        return renderFirstDayOtherClassFirstCardLine(dayName, classItem.class, classItem.cards);
    });
};

export const renderScheduleFullHeader = (groupList) => (
    <TableHead>
        <TableRow>
            <TableCell colSpan={3}>{i18n.t(FORM_GROUP_LABEL)}</TableCell>
            {groupList.map(({ title }) => (
                <TableCell key={shortid.generate()} className="groupLabelCell">
                    {title}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

const renderScheduleDays = (resultArray, semesterClasses) => {
    return resultArray.map(({ day, classes }) => {
        return renderDay(day, classes, semesterClasses.length || 0);
    });
};

export const renderFullSchedule = (fullResultSchedule) => {
    const { semester, groupList, semesterClasses, resultArray } = fullResultSchedule;
    const { startDay, description, endDay } = semester;
    currentWeekType = isWeekOdd(printWeekNumber(startDay));
    const scheduleTitle = `${description} (${startDay}-${endDay})`;

    return (
        <>
            <h1>{scheduleTitle}</h1>
            <TableContainer>
                <Table aria-label="sticky table">
                    {renderScheduleFullHeader(groupList)}
                    <TableBody>{renderScheduleDays(resultArray, semesterClasses)}</TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

const renderTeacherClassCell = (cards) => {
    let teacherLessonAddCellClass = '';

    if (cards !== undefined) {
        if (cards.cards.length > 1) {
            cards.cards.forEach((card, cardIndex) => {
                if (cards.cards[cardIndex + 1] && card.room !== cards.cards[cardIndex + 1].room) {
                    teacherLessonAddCellClass += 'intersection-on-schedule';
                }
            });
        }
    }
    const cardsProp = cards && cards.cards;
    return (
        <TableCell key={shortid.generate()} className={`lesson ${teacherLessonAddCellClass}`}>
            <TeacherTemporaryCardCell cards={cardsProp} />
        </TableCell>
    );
};

const renderClassRow = (classItem, days, scheduleRow) => (
    <TableRow key={shortid.generate()}>
        <TableCell className="lesson groupLabelCell">{renderClassCell(classItem)}</TableCell>
        {days.map((dayName) => {
            if (scheduleRow) {
                return renderTeacherClassCell(scheduleRow.find((item) => item.day === dayName));
            }
            return null;
        })}
    </TableRow>
);

export const renderWeekTable = (schedule) => {
    const { days, classes, cards } = schedule;
    return (
        <TableContainer>
            <Table aria-label="sticky table">
                {renderScheduleGroupHeader(days)}
                <TableBody>
                    {classes.map((classItem) => {
                        return renderClassRow(classItem, days, cards[classItem.id]);
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const renderLessonsFirstLine = (lessonItem) => {
    return (
        <>
            <TableCell>{lessonItem.lesson.subject_for_site}</TableCell>
            <TableCell>{lessonItem.lesson.group_name}</TableCell>
            <TableCell>{lessonItem.lesson.room.name}</TableCell>
        </>
    );
};

const renderLessonsRestLines = (lessons) => {
    if (lessons.length === 1) {
        return null;
    }
    let lessonClassName = '';
    lessonClassName = 'groupped';
    lessons.forEach((lessonItem, lessonIndex) => {
        if (
            lessons[lessonIndex + 1] &&
            (lessonItem.lesson.subject_for_site !==
                lessons[lessonIndex + 1].lesson.subject_for_site ||
                lessonItem.lesson.room.id !== lessons[lessonIndex + 1].lesson.room.id)
        ) {
            lessonClassName = 'overlap';
        }
    });
    return lessons.map((lessonItem, lessonIndex) => {
        if (lessonIndex === 0) {
            return null;
        }
        return (
            <TableRow className={lessonClassName} key={shortid.generate()}>
                <TableCell>{lessonItem.lesson.subject_for_site}</TableCell>
                <TableCell>{lessonItem.lesson.group_name}</TableCell>
                <TableCell>{lessonItem.lesson.room.name}</TableCell>
            </TableRow>
        );
    });
};

const renderFirstLineTable = (classItem) => {
    return (
        <TableRow key={shortid.generate()}>
            <TableCell rowSpan={classItem.lessons.length}>
                {`${classItem.class.class_name} ( ${classItem.class.startTime} - ${classItem.class.endTime})`}
            </TableCell>
            {renderLessonsFirstLine(classItem.lessons[0])}
        </TableRow>
    );
};

export const renderTeacherRangeDay = (schedule) => {
    if (schedule) {
        return (
            <TableContainer key={shortid.generate()}>
                <Table aria-label="sticky table">
                    <TableBody>
                        {schedule.map((classItem) => {
                            return (
                                <React.Fragment key={shortid.generate()}>
                                    {renderFirstLineTable(classItem)}
                                    {renderLessonsRestLines(classItem.lessons)}
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
    return null;
};

export const renderTeacherRangeSchedule = (schedule, viewTeacherScheduleResults) => {
    if (schedule === undefined) return null;
    if (schedule) {
        if (schedule.length === 0) {
            return i18n.t(EMPTY_SCHEDULE);
        }
        return schedule.map((dayItem) => {
            const parsed = Array.from(dayItem.date);

            const startDay = new Date(
                parsed[3] +
                    parsed[4] +
                    parsed[5] +
                    parsed[0] +
                    parsed[1] +
                    parsed[2] +
                    parsed[6] +
                    parsed[7] +
                    parsed[8] +
                    parsed[9],
            );
            return (
                <Card
                    additionClassName={`${viewTeacherScheduleResults} form-card teacher-schedule-day-card`}
                    key={shortid.generate()}
                >
                    <h3>
                        {`${dayItem.date} ( ${i18n.t(`day_of_week_${startDay.getDay() + 1}`)} )`}
                    </h3>
                    {renderTeacherRangeDay(dayItem.schedule)}
                </Card>
            );
        });
    }
    return null;
};
