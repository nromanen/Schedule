import { isEmpty } from 'lodash';
import { sortStrings } from '../utils/sortStrings';
import { filterClassesArray } from '../utils/sheduleUtils';

const mapFullSchedule = (schedule, semesterDays, semesterClasses) => {
    const parsedGroupList = schedule.map(({ group }) => group);
    parsedGroupList.sort((a, b) => sortStrings(a.title, b.title));
    const parsedResultArray = [];

    semesterDays.forEach((day) => {
        const tempClassesArray = [];
        semesterClasses.forEach((classItem) => {
            const tepmOddCardsArray = [];
            const tempEvenCardsArray = [];
            parsedGroupList.forEach((groupItem) => {
                const groupFull = schedule.find(
                    (groupFullIterate) => groupFullIterate.group.id === groupItem.id,
                );
                const dayFull = groupFull.days.find((dayFullIterate) => dayFullIterate.day === day);
                const classFull = dayFull.classes.find(
                    (dayFullIterable) => dayFullIterable.class.id === classItem.id,
                );
                tepmOddCardsArray.push({
                    group: groupItem,
                    card: classFull.weeks.odd,
                });
                tempEvenCardsArray.push({
                    group: groupItem,
                    card: classFull.weeks.even,
                });
            });
            tempClassesArray.push({
                class: classItem,
                cards: { odd: tepmOddCardsArray, even: tempEvenCardsArray },
            });
        });
        parsedResultArray.push({ day, classes: tempClassesArray });
    });

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

    days.forEach(({ day, even, odd }) => {
        odd.classes.forEach((classItem) => {
            if (parsedOddClasses.findIndex((oddClass) => oddClass.id === classItem.class.id) < 0) {
                parsedOddClasses.push(classItem.class);
            }
            if (parsedOddDays.indexOf(day) < 0) {
                parsedOddDays.push(day);
            }
            if (!(classItem.class.id in parsedOddArray)) {
                parsedOddArray[classItem.class.id] = [];
            }

            parsedOddArray[classItem.class.id].push({
                day,
                cards: classItem.lessons,
            });
        });

        even.classes.forEach((classItem) => {
            if (
                parsedEvenClasses.findIndex((evenClass) => evenClass.id === classItem.class.id) < 0
            ) {
                parsedEvenClasses.push(classItem.class);
            }
            if (parsedEvenDays.indexOf(day) < 0) {
                parsedEvenDays.push(day);
            }
            if (!(classItem.class.id in parsedEvenArray)) {
                parsedEvenArray[classItem.class.id] = [];
            }

            parsedEvenArray[classItem.class.id].push({
                day,
                cards: classItem.lessons,
            });
        });
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
