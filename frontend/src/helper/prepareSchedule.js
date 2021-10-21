import { cloneDeep, get, isEmpty, isNil } from 'lodash';
import { daysUppercase, daysWithClasses as daysArray } from '../constants/schedule/days';
import { sortStrings } from '../utils/sortStrings';

const prepareGroupClassesArray = (iterationItem, uppercaseDaysArray, parityArray) => {
    iterationItem.class.forEach((evenClas, clasIndex) => {
        if (!get(parityArray, clasIndex)) {
            parityArray[clasIndex] = { class: evenClas.class, cards: {} };
        }

        uppercaseDaysArray.forEach((dayArr) => {
            if (!get(parityArray[clasIndex].cards, dayArr)) {
                parityArray[clasIndex].cards[dayArr] = {};
            }
        });
        if (!isNil(evenClas.card)) {
            if (get(evenClas.card, 'teacher')) {
                parityArray[clasIndex].cards[iterationItem.day] = {
                    card: evenClas.card,
                };
            }
        }
    });
};

export const makeGroupSchedule = ({ semester, schedule }) => {
    const evenArray = [];
    const oddArray = [];
    let group = {};

    const evenDaysPrepArray = cloneDeep(daysArray);
    const oddDaysPrepArray = cloneDeep(daysArray);

    if (!isEmpty(schedule)) {
        const scheduleItem = schedule[0];
        const { group: groupData } = scheduleItem;
        group = groupData;

        scheduleItem.days.forEach((day) => {
            day.classes.forEach((classItem) => {
                evenDaysPrepArray.forEach((evenDayPrep, index) => {
                    if (evenDayPrep.day === day.day) {
                        evenDaysPrepArray[index].class[classItem.class.id] = {
                            class: classItem.class,
                            card: classItem.weeks.even,
                        };
                    }
                });
                oddDaysPrepArray.forEach((oddDayPrep, index) => {
                    if (oddDayPrep.day === day.day) {
                        oddDaysPrepArray[index].class[classItem.class.id] = {
                            class: classItem.class,
                            card: classItem.weeks.odd,
                        };
                    }
                });
            });
        });
    }

    evenDaysPrepArray.forEach((evenDay) => {
        prepareGroupClassesArray(evenDay, daysUppercase, evenArray);
    });

    oddDaysPrepArray.forEach((oddDay) => {
        prepareGroupClassesArray(oddDay, daysUppercase, oddArray);
    });

    return {
        semester,
        oddArray,
        evenArray,
        group,
    };
};

export const makeFullSchedule = (fullSchedule) => {
    const { schedule, semester } = fullSchedule;
    const groupsCount = schedule?.length || 0; // nande desu ka?
    const semesterDays = semester?.semester_days || []; // nande desu ka?
    const semesterClasses = semester?.semester_classes || []; // nande desu ka?
    let groupList = [];
    const resultArray = [];

    if (schedule) {
        groupList = schedule.map(({ group }) => group);
        semesterDays.forEach((day) => {
            const classesArray = [];
            semesterClasses.forEach((classItem) => {
                const oddArray = [];
                const evenArray = [];
                groupList.forEach((groupItem, index) => {
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
            resultArray.push({ day, classes: classesArray });
        });
        groupList.sort((a, b) => sortStrings(a.title, b.title));
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

const prepareTeacherClassesArray = (
    iterationArray,
    classesArray,
    daysArrayLocal,
    parityArray,
    day,
) => {
    iterationArray.forEach((iterationItem) => {
        if (classesArray.findIndex((oddClass) => oddClass.id === iterationItem.class.id) < 0) {
            classesArray.push(iterationItem.class);
        }
        if (!daysArrayLocal.includes(day)) {
            daysArrayLocal.push(day);
        }
        if (!(iterationItem.class.id in parityArray)) {
            parityArray[iterationItem.class.id] = []; // nande desu ka?
        }

        parityArray[iterationItem.class.id].push({
            day,
            cards: iterationItem.lessons,
        });
    });
};

export const makeTeacherSchedule = (teacherSchedule) => {
    const { semester } = teacherSchedule;
    let teacher = {};
    const evenArray = [];
    const oddArray = [];
    const oddDays = [];
    const evenDays = [];
    const oddClasses = [];
    const evenClasses = [];

    if (teacherSchedule?.days) {
        const { teacher: teacherData, days } = teacherSchedule;
        teacher = teacherData;

        days.forEach(({ day, odd, even }) => {
            prepareTeacherClassesArray(odd.classes, oddClasses, oddDays, oddArray, day);

            prepareTeacherClassesArray(even.classes, evenClasses, evenDays, evenArray, day);
        });
    }

    return {
        teacher,
        semester,
        odd: {
            days: oddDays,
            classes: oddClasses.sort((a, b) => sortStrings(a.startTime, b.startTime)),
            cards: oddArray,
        },
        even: {
            days: evenDays,
            classes: evenClasses.sort((a, b) => sortStrings(a.startTime, b.startTime)),
            cards: evenArray,
        },
    };
};
