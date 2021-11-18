import { cloneDeep, isEmpty } from 'lodash';
import { daysObject } from '../constants/schedule/days';

const mapGroupSchedule = (schedule) => {
    const parsedOddArray = [];
    const parsedEvenArray = [];
    const { days, group } = schedule[0];

    days.forEach(({ classes }) => {
        classes.forEach((classItem) => {
            if (classItem.weeks.even) {
                parsedEvenArray[classItem.class.id] = {
                    class: classItem.class,
                    cards: cloneDeep(daysObject),
                };
            }
            if (classItem.weeks.odd) {
                parsedOddArray[classItem.class.id] = {
                    class: classItem.class,
                    cards: cloneDeep(daysObject),
                };
            }
        });
    });

    days.forEach(({ classes, day }) => {
        classes.forEach((classItem) => {
            if (classItem.weeks.even) {
                parsedEvenArray[classItem.class.id].cards[day].card = classItem.weeks.even;
            }
            if (classItem.weeks.odd) {
                parsedOddArray[classItem.class.id].cards[day].card = classItem.weeks.odd;
            }
        });
    });

    return { parsedOddArray, parsedEvenArray, parsedGroup: group };
};

export const makeGroupSchedule = (groupSchedule) => {
    const { semester, schedule } = groupSchedule;
    let evenArray = [];
    let oddArray = [];
    let group = {};

    if (!isEmpty(schedule)) {
        const { parsedOddArray, parsedEvenArray, parsedGroup } = mapGroupSchedule(schedule);
        evenArray = parsedEvenArray;
        oddArray = parsedOddArray;
        group = parsedGroup;
    }
    return {
        semester,
        oddArray,
        evenArray,
        group,
    };
};
