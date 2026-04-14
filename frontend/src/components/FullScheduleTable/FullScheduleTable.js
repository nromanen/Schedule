import React, { useRef, useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import i18n from '../../i18n';
import { FORM_GROUP_LABEL } from '../../constants/translationLabels/formElements';
import LessonTemporaryCardCell from '../../containers/GroupSchedulePage/LessonTemporaryCardCell';
import { places } from '../../constants/places';
import {
    checkSemesterEnd,
    isWeekOdd,
    matchDayNumberSystemToDayName,
    printWeekNumber,
} from '../../utils/dateUtils';
import { ScheduleLegend } from '../../helper/renderScheduleTable';
import './FullScheduleTable.scss'

const renderClassCell = (classItem) =>
    `${classItem.class_name}\n\r\n\r${classItem.startTime} - ${classItem.endTime}`;

const isClassEmpty = (classItem) => {
    const { cards } = classItem;
    return (
        cards.odd.every((g) => g.card === null) &&
        cards.even.every((g) => g.card === null)
    );
};

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

const renderScheduleFullHeader = (groupList) => (
    <TableHead>
        <TableRow>
            <TableCell colSpan={3}>{i18n.t(FORM_GROUP_LABEL)}</TableCell>
            {groupList.map(({ title }) => (
                <TableCell key={title} className="groupLabelCell">
                    {title}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

const renderGroupCells = (groups, isOdd, weekType, isCurrentDay, dayName) => {
    const prepared = prepareGroups(groups, weekType, isOdd, isCurrentDay);

    return prepared.map((group, i) => {
        if (!group) return null;
        const { card, colspan, rowspan, classname } = group;
        return (
            <TableCell
                key={`${dayName}-${i}`}
                colSpan={colspan}
                rowSpan={rowspan}
                className={classname}
            >
                <LessonTemporaryCardCell card={card} day={dayName} place={places.TOGETHER} />
            </TableCell>
        );
    });
};

const renderFirstDayFirstClassFirstCardLine = (
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
            <React.Fragment key={`${dayName}-first`}>
                <TableRow className="day-first-row">
                    <TableCell
                        rowSpan={classesCount}
                        className={dayClassName}
                        data-day={i18n.t(`common:day_of_week_short_${dayName}`)}
                    />
                    <TableCell className={classClassName}>
                        {renderClassCell(classItem)}
                    </TableCell>
                    {renderGroupCells(weekGroups, todayWeekIsOdd, currentWeekType, false, dayName)}
                </TableRow>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment key={`${dayName}-first`}>
            <TableRow className="day-first-row">
                <TableCell
                    rowSpan={classesCount * 2}
                    className={dayClassName}
                    data-day={i18n.t(`common:day_of_week_short_${dayName}`)}
                />
                <TableCell className={classClassName} rowSpan={2}>
                    {renderClassCell(classItem)}
                </TableCell>
                <TableCell className={`${classClassName + oddWeekClass} subClassName`}>1</TableCell>
                {renderGroupCells(groups.odd, true, currentWeekType, isCurrentDay, dayName)}
            </TableRow>
            <TableRow>
                <TableCell className={`${classClassName + evenWeekClass} subClassName`}>2</TableCell>
                {renderGroupCells(groups.even, false, currentWeekType, isCurrentDay, dayName)}
            </TableRow>
        </React.Fragment>
    );
};

const renderFirstDayOtherClassFirstCardLine = (
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
            <React.Fragment key={`${dayName}-${classItem.id}`}>
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
        <React.Fragment key={`${dayName}-${classItem.id}`}>
            <TableRow>
                <TableCell className={classClassName} rowSpan={2}>
                    {renderClassCell(classItem)}
                </TableCell>
                <TableCell className={`${classClassName + oddWeekClass} subClassName`}>1</TableCell>
                {renderGroupCells(groups.odd, true, currentWeekType, isCurrentDay, dayName)}
            </TableRow>
            <TableRow>
                <TableCell className={`${classClassName + evenWeekClass} subClassName`}>2</TableCell>
                {renderGroupCells(groups.even, false, currentWeekType, isCurrentDay, dayName)}
            </TableRow>
        </React.Fragment>
    );
};

const renderDay = (dayName, dayItem, semesterClassesCount, currentWeekType, currentDay, todayWeekIsOdd = null) => {
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

const renderScheduleDays = (resultArray, semesterClasses, currentWeekType, currentDay, todayWeekIsOdd) =>
    resultArray.map(({ day, classes }) =>
        renderDay(day, classes, semesterClasses.length || 0, currentWeekType, currentDay, todayWeekIsOdd)
    );

const FullScheduleTable = ({ fullResultSchedule, todayWeekIsOdd = null }) => {
    const { semester, groupList, semesterClasses, resultArray } = fullResultSchedule;
    const currentWeekType = isWeekOdd(printWeekNumber(semester.startDay));
    const currentDay = checkSemesterEnd(semester.endDay) ? '' : matchDayNumberSystemToDayName();
    const isSemesterEnded = checkSemesterEnd(semester.endDay);

    const [visibleDay, setVisibleDay] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const dayCells = container.querySelectorAll('td.dayNameCell');
            const containerRect = container.getBoundingClientRect();
            let day = '';
            dayCells.forEach(cell => {
                const rect = cell.getBoundingClientRect();
                if (
                    rect.top <= containerRect.top + containerRect.height / 2 &&
                    rect.bottom >= containerRect.top
                ) {
                    day = cell.dataset.day || '';
                }
            });
            setVisibleDay(day);
        };

        container.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {isSemesterEnded && (
                <p className="semester-ended-notice">{i18n.t('semester_ended')}</p>
            )}
            <ScheduleLegend variant="basic" />
            <div className="full-schedule-wrapper">
                {visibleDay && (
                    <div className="floating-day-badge">{visibleDay}</div>
                )}
                <TableContainer ref={containerRef}>
                    <Table aria-label="sticky table">
                        {renderScheduleFullHeader(groupList)}
                        <TableBody>
                            {renderScheduleDays(resultArray, semesterClasses, currentWeekType, currentDay, todayWeekIsOdd)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default FullScheduleTable;