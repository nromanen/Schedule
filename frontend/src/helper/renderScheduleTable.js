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

import {daysUppercase,} from '../constants/schedule/days';
import {FORM_GROUP_LABEL, GROUP_Y_LABEL} from '../constants/translationLabels/formElements';
import {EMPTY_SCHEDULE} from '../constants/translationLabels/common';
import LessonTemporaryCardCell from '../containers/GroupSchedulePage/LessonTemporaryCardCell';
import TeacherTemporaryCardCell from '../containers/GroupSchedulePage/TeacherTemporaryCardCell';
import { places } from '../constants/places';
import { lessonTypeColors, getLessonTypeColor } from '../constants/lessonTypeColors';
import {getWeekParity, isWeekOdd, transformSemesterDate} from "../utils/weekUtils";
import './renderScheduleTable.scss';

const shortid = require('shortid');

export const checkSemesterEnd = (semesterEndDate) => {
    const today = new Date();
    const endDate = transformSemesterDate(semesterEndDate);
    return today - endDate > 0;
};

export const matchDayNumberSysytemToDayName = () => {
    const now = new Date();
    return daysUppercase[now.getDay() - 1];
};

const printWeekNumber = (startScheduleDate) => {
    const date = new Date();
    return getWeekParity(startScheduleDate, date);
};

const renderClassCell = (classItem) => {
    return `${classItem.class_name}\n\r\n\r${classItem.startTime} - ${classItem.endTime}`;
};

export const renderGroupDayClass = (
    classDay,
    isOddWeek,
    semesterDays,
    currentWeekType,
    currentDay,
) => {
    return (
        <TableRow key={shortid.generate()}>
            <TableCell className=" lesson groupLabelCell">
                {renderClassCell(classDay.class)}
            </TableCell>
            {classDay.lessons.map(({ day, card }) => {
                let className = 'lesson ';
                if (currentDay === day && currentWeekType === isOddWeek) {
                    className += ' currentDay';
                }
                return (
                    semesterDays.includes(day) && (
                        <TableCell key={shortid.generate()} className={className}>
                            <LessonTemporaryCardCell card={card} day={day} place={places.TOGETHER}/>
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
    const currentWeekType = isWeekOdd(printWeekNumber(semester.startDay));
    const currentDay = checkSemesterEnd(semester.endDay) ? '' : matchDayNumberSysytemToDayName();
    return (
        <TableContainer>
            <Table aria-label="sticky table">
                {semester && renderScheduleGroupHeader(semester.semester_days)}
                <TableBody>
                    {classes.map((classDay) => {
                        if (classDay) {
                            return renderGroupDayClass(
                                classDay,
                                isOdd,
                                semester.semester_days,
                                currentWeekType,
                                currentDay,
                            );
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
                else {
                    break;
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
                <LessonTemporaryCardCell card={card} day={dayName} place={places.TOGETHER} />
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

export const renderFirstDayFirstClassFirstCardLine = (
    dayName,
    classItem,
    groups,
    classesCount,
    currentWeekType,
    currentDay,
    todayWeekIsOdd = null,
) => {
    let dayClassName = 'dayNameCell ';
    const classClassName = 'classNameCell ';
    const isCurrentDay = dayName === currentDay;

    let oddWeekClass = '';
    let evenWeekClass = '';
    if (isCurrentDay) {
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

    if (todayWeekIsOdd !== null) {
        const weekGroups = todayWeekIsOdd ? groups.odd : groups.even;
        dayClassName = 'dayNameCell';

        return (
            <React.Fragment key={shortid.generate()}>
                <TableRow className="day-first-row">
                    <TableCell rowSpan={classesCount} className={dayClassName}>
                    <span className="dayName">
                        <b>{i18n.t(`common:day_of_week_${dayName}`)}</b>
                    </span>
                    </TableCell>
                    <TableCell className={classClassName}>
                        {renderClassCell(classItem)}
                    </TableCell>
                    {renderGroupCells(weekGroups, todayWeekIsOdd, currentWeekType, false, dayName)}
                </TableRow>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment key={shortid.generate()}>
            <TableRow className="day-first-row">
                <TableCell rowSpan={classesCount * 2} className={dayClassName}>
                    <span className="dayName">
                        <b>{i18n.t(`common:day_of_week_${dayName}`)}</b>
                    </span>
                </TableCell>
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

export const renderFirstDayOtherClassFirstCardLine = (
    dayName,
    classItem,
    groups,
    currentWeekType,
    currentDay,
    todayWeekIsOdd = null,
) => {
    const classClassName = 'classNameCell ';
    const isCurrentDay = dayName === currentDay;
    let oddWeekClass = '';
    let evenWeekClass = '';

    if (isCurrentDay) {
        if (currentWeekType) {
            oddWeekClass = ' currentDay';
        } else {
            evenWeekClass = ' currentDay';
        }
    }

    if (todayWeekIsOdd !== null) {
        const weekGroups = todayWeekIsOdd ? groups.odd : groups.even;

        return (
            <React.Fragment key={shortid.generate()}>
                <TableRow>
                    <TableCell className={classClassName}>
                        {renderClassCell(classItem)}
                    </TableCell>
                    {renderGroupCells(weekGroups, todayWeekIsOdd, currentWeekType, false, dayName)}
                </TableRow>
            </React.Fragment>
        );
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

const isClassEmpty = (classItem) => {
    const { cards } = classItem;
    const allOddEmpty = cards.odd.every(group => group.card === null);
    const allEvenEmpty = cards.even.every(group => group.card === null);
    return allOddEmpty && allEvenEmpty;
};

export const renderDay = (dayName, dayItem, semesterClassesCount, currentWeekType, currentDay, todayWeekIsOdd = null) => {
    let lastNonEmptyIndex = dayItem.length - 1;
    while (lastNonEmptyIndex >= 0 && isClassEmpty(dayItem[lastNonEmptyIndex])) {
        lastNonEmptyIndex--;
    }
    const trimmedDayItem = dayItem.slice(0, lastNonEmptyIndex + 1);

    if (trimmedDayItem.length === 0) return null;

    const actualClassesCount = trimmedDayItem.length;

    return trimmedDayItem.map((classItem, classIndex) => {
        if (classIndex === 0) {
            return renderFirstDayFirstClassFirstCardLine(
                dayName,
                classItem.class,
                classItem.cards,
                actualClassesCount,
                currentWeekType,
                currentDay,
                todayWeekIsOdd,
            );
        }
        return renderFirstDayOtherClassFirstCardLine(
            dayName,
            classItem.class,
            classItem.cards,
            currentWeekType,
            currentDay,
            todayWeekIsOdd,
        );
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

const renderScheduleDays = (resultArray, semesterClasses, currentWeekType, currentDay, todayWeekIsOdd = null) => {
    return resultArray.map(({ day, classes }) => {
        return renderDay(day, classes, semesterClasses.length || 0, currentWeekType, currentDay, todayWeekIsOdd);
    });
};

export const ScheduleLegend = () => {
    const legendItems = [
        { type: 'lecture',    label: i18n.t('lesson_type_lecture',    'Лекція') },
        { type: 'practical',  label: i18n.t('lesson_type_practical',  'Практична') },
        { type: 'laboratory', label: i18n.t('lesson_type_lab',        'Лабораторна') },
    ];

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

export const renderFullSchedule = (fullResultSchedule, todayWeekIsOdd = null) => {
    const { semester, groupList, semesterClasses, resultArray } = fullResultSchedule;
    const currentWeekType = isWeekOdd(printWeekNumber(semester.startDay));
    const currentDay = checkSemesterEnd(semester.endDay) ? '' : matchDayNumberSysytemToDayName();
    const isSemesterEnded = checkSemesterEnd(semester.endDay);

    return (
        <>
            {isSemesterEnded && (
                <p className="semester-ended-notice">{i18n.t('semester_ended')}</p>
            )}
            <ScheduleLegend />
            <TableContainer>
                <Table aria-label="sticky table">
                    {renderScheduleFullHeader(groupList)}
                    <TableBody>
                        {renderScheduleDays(resultArray, semesterClasses, currentWeekType, currentDay, todayWeekIsOdd)}
                    </TableBody>
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
            const cell = scheduleRow?.find((item) => item.day === dayName);
            return renderTeacherClassCell(cell);
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
    if (isNil(schedule)) return null;
    if (schedule.length === 0) {
        return i18n.t(EMPTY_SCHEDULE);
    }
    return schedule.map((dayItem) => {
        const startDay = transformSemesterDate(dayItem.date);

        return (
            <Card
                additionClassName={`${viewTeacherScheduleResults} form-card teacher-schedule-day-card`}
                key={shortid.generate()}
            >
                <h3>{`${dayItem.date} ( ${i18n.t(`day_of_week_${startDay.getDay() + 1}`)} )`}</h3>
                {renderTeacherRangeDay(dayItem.schedule)}
            </Card>
        );
    });
};