import React from 'react';
import { daysUppercase } from '../../constants/schedule/days';
import CalendarSchedule from './CalendarSchedule';

/**
 * Transforms groupSchedule (oddArray/evenArray) into fullSchedule format
 * compatible with CalendarSchedule component.
 */
const transformGroupToCalendar = (groupSchedule) => {
    const { semester, group, oddArray, evenArray } = groupSchedule;

    const classMap = {};
    const processArray = (arr) => {
        if (!arr) return;
        arr.forEach(item => {
            if (item && item.class) {
                classMap[item.class.id] = item.class;
            }
        });
    };
    processArray(oddArray);
    processArray(evenArray);

    const semesterClasses = Object.values(classMap).sort((a, b) => a.id - b.id);
    const semesterDays = semester.semester_days || daysUppercase.slice(0, 7);

    const resultArray = semesterDays.map(dayName => {
        const classes = semesterClasses.map(classItem => {
            const oddEntry = oddArray?.find(item => item && item.class.id === classItem.id);
            const oddLesson = oddEntry?.lessons?.find(l => l.day === dayName);
            const oddCard = oddLesson?.card || null;

            const evenEntry = evenArray?.find(item => item && item.class.id === classItem.id);
            const evenLesson = evenEntry?.lessons?.find(l => l.day === dayName);
            const evenCard = evenLesson?.card || null;

            return {
                class: classItem,
                cards: {
                    odd: [{ group, card: oddCard }],
                    even: [{ group, card: evenCard }],
                },
            };
        });

        return { day: dayName, classes };
    });

    return {
        semester,
        groupList: [group],
        semesterClasses,
        resultArray,
    };
};

/**
 * Thin wrapper — transforms group data, delegates rendering to CalendarSchedule.
 * No title, no toggle, no legend — renderSchedule handles all of that.
 */
const CalendarGroupSchedule = ({ groupSchedule, viewMode, t }) => {
    const calendarData = transformGroupToCalendar(groupSchedule);
    return (
        <CalendarSchedule
            fullSchedule={calendarData}
            viewMode={viewMode}
            t={t}
        />
    );
};

export default CalendarGroupSchedule;