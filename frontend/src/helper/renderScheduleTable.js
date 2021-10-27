import React from 'react';
import { isEmpty, isEqual, isNil } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Card from '../share/Card/Card';

import i18n from '../i18n';

import { daysUppercase } from '../constants/schedule/days';
import { places } from '../constants/places';
import './renderScheduleTable.scss';
import {
    getTeacherForSite,
    getTeacherFullName,
    getTeacherWithShortPosition,
} from './renderTeacher';
import { GROUP_Y_LABEL, FORM_GROUP_LABEL } from '../constants/translationLabels/formElements';
import {
    EMPTY_SCHEDULE,
    COMMON_REGULAR_LESSON_LABEL,
    COMMON_LINK_TO_MEETING_WORD,
    COMMON_VACATION_LABEL,
} from '../constants/translationLabels/common';
import { CustomDialog } from '../share/DialogWindows';
import { dialogTypes } from '../constants/dialogs';

const shortid = require('shortid');

const matchDayNumberSysytemToDayName = () => {
    const now = new Date();
    return daysUppercase[now.getDay() - 1];
};
const currentDay = matchDayNumberSysytemToDayName();

const getHref = (link) => {
    return (
        <a title={link} className="link-to-meeting" href={link} target="_blank" rel="noreferrer">
            {i18n.t(COMMON_LINK_TO_MEETING_WORD)}
        </a>
    );
};
const setLink = (card, place) => {
    if (place === places.TOGETHER) {
        return <CustomDialog type={dialogTypes.MEETING_LINK} {...card} />;
    }
    if (place === places.ONLINE) {
        return getHref(card.linkToMeeting);
    }
    return null;
};

const getWeekNumber = (startScheduleDate, date) => {
    const parsed = Array.from(startScheduleDate);

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

    const numberOfDays = Math.floor((date - startDay) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
};
const printWeekNumber = (startScheduleDate) => {
    const date = new Date();
    return getWeekNumber(startScheduleDate, date);
};

function isOddFunction(num) {
    return num % 2;
}

let currentWeekType = 0;

const renderClassCell = (classItem) => {
    return `${classItem.class_name}\n\r\n\r${classItem.startTime} - ${classItem.endTime}`;
};

export const prepareLessonCardCell = (card) => {
    let inner = '';
    if (card !== undefined && card !== null) {
        inner = `${getTeacherWithShortPosition(card.teacher)}\n${card.subjectForSite}\n`;
    }
    return inner;
};
export const prepareLessonSubCardCell = (card, place) => {
    const room = place !== places.ONLINE ? card.room : '';
    let inner = '';
    if (card !== undefined && card !== null) {
        inner = i18n.t(`formElements:lesson_type_${card.lessonType.toLowerCase()}_label`);
        if (room !== '') {
            inner = `(${inner}, ${card.room.name})`;
        }
    }
    return inner;
};

export const prepareLessonTemporaryCardCell = (card, place, day) => {
    if (isNil(card)) return '';

    const { temporary_schedule: tempSchedule, linkToMeeting } = card;

    const meetingLink = linkToMeeting && setLink(card, place);

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
        <>
            <p title={i18n.t(`common:day_of_week_${day}`)}>{prepareLessonCardCell(card)}</p>
            <p>{prepareLessonSubCardCell(card, place)}</p>
            {meetingLink}
        </>
    );
};

export const prepareTeacherCardCell = (card) => {
    let inner = '';
    if (card !== undefined && card !== null) {
        inner = card.subjectForSite;
    }
    return inner;
};

export const buildLessonWithRoom = (card, place) => {
    const room = place !== places.ONLINE ? card.room : '';
    let inner = '';
    inner += `${prepareTeacherCardCell(card)}\n`;
    inner +=
        room !== ''
            ? `(${i18n.t(`formElements:lesson_type_${card.lessonType.toLowerCase()}_label`)} ,${
                  card.room
              })\n`
            : (inner += `${i18n.t(
                  `formElements:lesson_type_${card.lessonType.toLowerCase()}_label`,
              )}\n`);

    return inner;
};

export const prepareTeacherCardRegularCell = (card, place) => {
    let inner = buildLessonWithRoom(card, place);
    inner += `\n${card.group.title}\n`;
    return inner;
};

export const buildGroupNumber = (card) => {
    return `${card.group.title}\n`;
};

const prepareTitleAndInner = (options) => {
    const { cards, place } = options;
    let { title, inner } = options;
    cards.forEach((cardItem) => {
        const { temporary_schedule: tempSchedule } = cardItem;

        if (!tempSchedule) {
            inner += buildGroupNumber(cardItem);
        } else {
            const { vacation, date, teacher, room, subjectForSite } = tempSchedule;

            const roomLabel = room ? `${subjectForSite}, ${room.name}\n` : `${subjectForSite}\n`;
            inner += vacation
                ? `${date}\n${i18n.t(COMMON_VACATION_LABEL)}\n`
                : `${date}\n${getTeacherFullName(teacher)}\n${roomLabel}`;
        }
        title += `${i18n.t(COMMON_REGULAR_LESSON_LABEL)}\r${prepareTeacherCardRegularCell(
            cardItem,
            place,
        )}\r`;
    });
    return { title, inner };
};

export const prepareTeacherTemporaryCardCell = (cards, place) => {
    if (!cards) {
        return '';
    }
    let inner = '';
    let title = '';

    if (cards.length === 1) {
        if (isNil(cards[0])) {
            return '';
        }

        const card = cards[0];
        const { temporary_schedule: tempSchedule, linkToMeeting } = card;

        const meetingLink = linkToMeeting && setLink(card, place);

        if (!tempSchedule) {
            return (
                <>
                    {prepareTeacherCardRegularCell(card, place)}
                    {meetingLink}
                </>
            );
        }

        const { date, room, vacation, subjectForSite } = tempSchedule;
        const roomLabel = tempSchedule.room
            ? `(${subjectForSite}, ${room.name})\n`
            : `${subjectForSite}\n`;

        inner = `${date}\n`;
        inner += vacation ? `${i18n.t(COMMON_VACATION_LABEL)}` : `${roomLabel}`;

        title = `${i18n.t(COMMON_REGULAR_LESSON_LABEL)}\r${prepareTeacherCardRegularCell(
            card,
            place,
        )}`;
        return (
            <p className="temporary-class" title={title}>
                {inner}
                {meetingLink}
            </p>
        );
    }
    const card = cards[0];

    inner += buildLessonWithRoom(card, place);

    const { title: resTitle, inner: resInner } = prepareTitleAndInner({
        title,
        inner,
        cards,
        place,
    });
    return (
        <p className="temporary-class" title={resTitle}>
            {resInner}
            {card.linkToMeeting && setLink(card, place)}
        </p>
    );
};

export const renderGroupDayClass = (classDay, isOddWeek, place, semesterDays) => {
    const res = [];
    Object.entries(classDay.cards).forEach((pair) => {
        const [key, value] = pair;
        value.day = key;
        res.push(value);
    });
    return (
        <TableRow key={shortid.generate()}>
            <TableCell className=" lesson groupLabelCell">
                {renderClassCell(classDay.class)}
            </TableCell>
            {res.map((day) => {
                let className = 'lesson ';
                if (currentDay === day.day) {
                    if (
                        (currentWeekType === 1 && isOddWeek === 0) ||
                        (currentWeekType === 0 && isOddWeek === 1)
                    ) {
                        className += ' currentDay';
                    }
                }
                return (
                    semesterDays.includes(day.day) && (
                        <TableCell key={shortid.generate()} className={className}>
                            {prepareLessonTemporaryCardCell(day.card, place, day.day)}
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

export const renderGroupTable = (classes, isOdd, semester, place) => {
    if (isEmpty(classes)) return <h2>Schedule is empty</h2>; // ALERT
    if (semester) {
        currentWeekType = isOddFunction(printWeekNumber(semester.startDay));
    }
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
                                place,
                                semester.semester_days,
                            );
                        }
                        return null;
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export const renderGroupCells = (
    groups,
    place,
    isOdd = 0,
    currentWeekTypeNumber = 0,
    isCurrentDay = 0,
    dayName,
) => {
    const prepareGroups = (groupsArray) => {
        // TODO map => reduce
        return groupsArray.map((group, groupIndex) => {
            const { card } = group;
            let colspan = 1;
            let rowspan = 1;
            let classname = 'lesson';

            if (currentWeekTypeNumber === isOdd && isCurrentDay) {
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
                {prepareLessonTemporaryCardCell(card, place, dayName)}
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
    place,
) => {
    let dayClassName = 'dayNameCell ';
    const classClassName = 'classNameCell ';

    let oddWeekClass = '';
    let evenWeekClass = '';
    if (currentDay === dayName) {
        dayClassName += ' currentDay';

        if (currentWeekType === 1) {
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
                {renderGroupCells(groups.odd, place, 0, 0, 0, dayName)}
            </TableRow>
            <TableRow>
                <TableCell className={`${classClassName + evenWeekClass} subClassName`}>
                    2
                </TableCell>
                {renderGroupCells(groups.even, place, 0, 0, 0, dayName)}
            </TableRow>
        </React.Fragment>
    );
};

export const renderFirstDayOtherClassFirstCardLine = (dayName, classItem, groups, place) => {
    const classClassName = 'classNameCell ';
    let oddWeekClass = '';
    let evenWeekClass = '';

    if (currentDay === dayName) {
        if (currentWeekType === 1) {
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
                {renderGroupCells(groups.odd, place, 1, 0, 0, dayName)}
            </TableRow>
            <TableRow>
                <TableCell className={`${classClassName + evenWeekClass} subClassName`}>
                    2
                </TableCell>
                {renderGroupCells(groups.even, place, 0, 0, 0, dayName)}
            </TableRow>
        </React.Fragment>
    );
};

export const renderDay = (dayName, dayItem, semesterClassesCount, place) => {
    return dayItem.map((classItem, classIndex) => {
        if (classIndex === 0) {
            return renderFirstDayFirstClassFirstCardLine(
                dayName,
                classItem.class,
                classItem.cards,
                semesterClassesCount,
                place,
            );
        }
        return renderFirstDayOtherClassFirstCardLine(
            dayName,
            classItem.class,
            classItem.cards,
            place,
        );
    });
};

export const renderScheduleFullHeader = (groupList) => (
    <TableHead>
        <TableRow>
            <TableCell colSpan={3}>{i18n.t(FORM_GROUP_LABEL)}</TableCell>
            {groupList.map((group) => (
                <TableCell key={shortid.generate()} className="groupLabelCell">
                    {group.title}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

const renderScheduleDays = (fullResultSchedule, place) => {
    return fullResultSchedule.resultArray.map((dayItem) => {
        return renderDay(
            dayItem.day,
            dayItem.classes,
            fullResultSchedule.semesterClasses.length || 0,
            place,
        );
    });
};

export const renderFullSchedule = (fullResultSchedule, place) => {
    currentWeekType = isOddFunction(printWeekNumber(fullResultSchedule.semester.startDay));
    let scheduleTitle = '';
    if (fullResultSchedule.semester) {
        scheduleTitle = `${fullResultSchedule.semester.description} (${fullResultSchedule.semester.startDay}-${fullResultSchedule.semester.endDay})`;
    }

    return (
        <>
            <h1>{scheduleTitle}</h1>
            <TableContainer>
                <Table aria-label="sticky table">
                    {renderScheduleFullHeader(fullResultSchedule.groupList)}
                    <TableBody>{renderScheduleDays(fullResultSchedule, place)}</TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

const renderTeacherClassCell = (cards, place) => {
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
    return (
        <TableCell key={shortid.generate()} className={`lesson ${teacherLessonAddCellClass}`}>
            {prepareTeacherTemporaryCardCell(cards && cards.cards, place)}
        </TableCell>
    );
};

const renderClassRow = (classItem, days, scheduleRow, place) => (
    <TableRow key={shortid.generate()}>
        <TableCell className="lesson groupLabelCell">{renderClassCell(classItem)}</TableCell>
        {days.map((dayName) => {
            if (scheduleRow) {
                return renderTeacherClassCell(
                    scheduleRow.find((clas) => clas.day === dayName),
                    place,
                );
            }
            return null;
        })}
    </TableRow>
);

export const renderWeekTable = (schedule, place) => {
    if (!isEmpty(schedule)) {
        return (
            <TableContainer>
                <Table aria-label="sticky table">
                    {renderScheduleGroupHeader(schedule.days)}
                    <TableBody>
                        {schedule.classes.map((classItem) => {
                            return renderClassRow(
                                classItem,
                                schedule.days,
                                schedule.cards[classItem.id],
                                place,
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
    return <h2>Schedule is empty</h2>; // ALERT
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
