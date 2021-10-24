import { cloneDeep, isEmpty } from 'lodash';
import { sortStrings } from '../utils/sortStrings';
import { filterClassesArray } from '../utils/sheduleUtils';
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

const mapFullSchedule = (schedule, semesterDays, semesterClasses) => {
    const parsedGroupList = schedule.map(({ group }) => group);
    const parsedResultArray = [];

    semesterDays.forEach((day) => {
        const classesArray = [];
        semesterClasses.forEach((classItem) => {
            const oddArray = [];
            const evenArray = [];
            parsedGroupList.forEach((groupItem, index) => {
                const dayFull = schedule[index].days.find(
                    (dayFullIterate) => dayFullIterate.day === day,
                );
                const classFull = dayFull.classes.find(
                    (dayFullIterable) => dayFullIterable.class.id === classItem.id,
                );
                oddArray.push({
                    group: groupItem,
                    card: classFull.weeks.odd,
                });
                evenArray.push({
                    group: groupItem,
                    card: classFull.weeks.even,
                });
            });
            classesArray.push({
                class: classItem,
                cards: { odd: oddArray, even: evenArray },
            });
        });
        parsedResultArray.push({ day, classes: classesArray });
    });
    parsedGroupList.sort((a, b) => sortStrings(a.title, b.title));
    return { parsedGroupList, parsedResultArray };
};

export const makeFullSchedule = (fullSchedule) => {
    const { schedule, semester } = fullSchedule;
    const groupsCount = schedule?.length || 0; // nande desu ka?
    const semesterDays = semester?.semester_days || []; // nande desu ka?
    const semesterClasses = semester?.semester_classes || []; // nande desu ka?
    let groupList = [];
    let resultArray = [];

    if (!isEmpty(schedule)) {
        const { parsedGroupList, parsedResultArray } = mapFullSchedule(
            schedule,
            semesterDays,
            semesterClasses,
        );
        groupList = parsedGroupList;
        resultArray = parsedResultArray;
    }

    return {
        semester,
        schedule,
        semesterClasses,
        semesterDays,
        groupsCount,
        groupList,
        resultArray,
    };
};

const mapTeacherSchedule = (days) => {
    const parsedEvenArray = [];
    const parsedOddArray = [];
    const parsedOddDays = [];
    const parsedEvenDays = [];
    const parsedOddClasses = [];
    const parsedEvenClasses = [];

    days.forEach((dayItem) => {
        if (!isEmpty(dayItem.even.classes)) {
            parsedEvenDays.push(dayItem.day);
            dayItem.even.classes.forEach((classItem) => {
                parsedEvenClasses.push(classItem.class);
                parsedEvenArray[classItem.class.id] = [{ day: dayItem.day, cards: [] }];
                classItem.lessons.forEach((lessonItem) => {
                    parsedEvenArray[classItem.class.id][0].cards.push(lessonItem);
                });
            });
        }
        if (!isEmpty(dayItem.odd.classes)) {
            parsedOddDays.push(dayItem.day);
            dayItem.odd.classes.forEach((classItem) => {
                parsedOddClasses.push(classItem.class);
                parsedOddArray[classItem.class.id] = [{ day: dayItem.day, cards: [] }];
                classItem.lessons.forEach((lessonItem) => {
                    parsedOddArray[classItem.class.id][0].cards.push(lessonItem);
                });
            });
        }
    });

    const parsedOdd = {
        days: parsedOddDays,
        classes: filterClassesArray(parsedOddClasses).sort((a, b) =>
            sortStrings(a.startTime, b.startTime),
        ),
        cards: parsedOddArray,
    };
    const parsedEven = {
        days: parsedEvenDays,
        classes: filterClassesArray(parsedEvenClasses).sort((a, b) =>
            sortStrings(a.startTime, b.startTime),
        ),
        cards: parsedEvenArray,
    };
    return { parsedOdd, parsedEven };
};

export const makeTeacherSchedule = (teacherSchedule) => {
    const { semester, days, teacher } = teacherSchedule;
    let odd = {};
    let even = {};

    if (!isEmpty(days)) {
        const { parsedEven, parsedOdd } = mapTeacherSchedule(days);
        odd = parsedOdd;
        even = parsedEven;
    }

    return {
        teacher,
        semester,
        odd,
        even,
    };
};
