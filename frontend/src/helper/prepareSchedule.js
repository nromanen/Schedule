import { cloneDeep, get, isEmpty, isNil } from 'lodash';
import { daysUppercase, daysWithClasses as daysArray } from '../constants/schedule/days';
import { sortStrings } from '../utils/sortStrings';

const filterClassesArray = (inputArray) => {
    return inputArray.filter((item, index, array) => {
        const resIndex = array.findIndex((findItem) => findItem.id === item.id);
        return resIndex === index;
    });
};

export const makeGroupSchedule = (groupSchedule) => {
    const { semester, schedule } = groupSchedule;
    const evenArray = [];
    const oddArray = [];
    let groupData = {};

    if (!isEmpty(schedule)) {
        const { days, group } = schedule[0];
        groupData = group;
        days.forEach((dayItem) => {
            dayItem.classes.forEach((classItem) => {
                if (classItem.weeks.even) {
                    evenArray[classItem.class.id] = {
                        class: classItem.class,
                        cards: {
                            MONDAY: {},
                            TUESDAY: {},
                            WEDNESDAY: {},
                            THURSDAY: {},
                            FRIDAY: {},
                            SATURDAY: {},
                            SUNDAY: {},
                        },
                    };
                }
                if (classItem.weeks.odd) {
                    oddArray[classItem.class.id] = {
                        class: classItem.class,
                        cards: {
                            MONDAY: {},
                            TUESDAY: {},
                            WEDNESDAY: {},
                            THURSDAY: {},
                            FRIDAY: {},
                            SATURDAY: {},
                            SUNDAY: {},
                        },
                    };
                }
            });
        });

        days.forEach((dayItem) => {
            dayItem.classes.forEach((classItem) => {
                if (classItem.weeks.even) {
                    evenArray[classItem.class.id].cards[dayItem.day].card = classItem.weeks.even;
                }
                if (classItem.weeks.odd) {
                    oddArray[classItem.class.id].cards[dayItem.day].card = classItem.weeks.odd;
                }
            });
        });
    }
    return {
        semester,
        oddArray,
        evenArray,
        group: groupData,
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

export const makeTeacherSchedule = (teacherSchedule) => {
    const { semester, days, teacher } = teacherSchedule;
    const evenArray = [];
    const oddArray = [];
    const oddDays = [];
    const evenDays = [];
    const oddClasses = [];
    const evenClasses = [];

    if (!isEmpty(days)) {
        days.forEach((dayItem) => {
            if (!isEmpty(dayItem.even.classes)) {
                evenDays.push(dayItem.day);
                dayItem.even.classes.forEach((classItem) => {
                    evenClasses.push(classItem.class);
                    evenArray[classItem.class.id] = [{ day: dayItem.day, cards: [] }];
                    classItem.lessons.forEach((lessonItem) => {
                        evenArray[classItem.class.id][0].cards.push(lessonItem);
                    });
                });
            }
            if (!isEmpty(dayItem.odd.classes)) {
                oddDays.push(dayItem.day);
                dayItem.odd.classes.forEach((classItem) => {
                    oddClasses.push(classItem.class);
                    oddArray[classItem.class.id] = [{ day: dayItem.day, cards: [] }];
                    classItem.lessons.forEach((lessonItem) => {
                        oddArray[classItem.class.id][0].cards.push(lessonItem);
                    });
                });
            }
        });
    }

    return {
        teacher,
        semester,
        odd: {
            days: oddDays,
            classes: filterClassesArray(oddClasses).sort((a, b) =>
                sortStrings(a.startTime, b.startTime),
            ),
            cards: oddArray,
        },
        even: {
            days: evenDays,
            classes: filterClassesArray(evenClasses).sort((a, b) =>
                sortStrings(a.startTime, b.startTime),
            ),
            cards: evenArray,
        },
    };
};
