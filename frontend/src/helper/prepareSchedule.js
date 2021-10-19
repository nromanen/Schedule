import { cloneDeep, get, isEmpty } from 'lodash';
import { daysUppercase, daysWithClasses as daysArray } from '../constants/schedule/days';
import { sortStrings } from '../utils/sortStrings';

export const makeGroupSchedule = ({ semester, schedule }) => {
    const evenArray = [];
    const oddArray = [];
    let group = {};

    const evenDaysPrepArray = cloneDeep(daysArray);
    const oddDaysPrepArray = cloneDeep(daysArray);
    // TODO forEach (where errors)=>reduce

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
        evenDay.class.forEach((evenClas, clasIndex) => {
            if (!get(evenArray, clasIndex)) {
                evenArray[clasIndex] = { class: evenClas.class, cards: {} };
            }

            daysUppercase.forEach((dayArr) => {
                if (!get(evenArray[clasIndex].cards, dayArr)) {
                    evenArray[clasIndex].cards[dayArr] = {};
                }
            });
            if (evenClas.card !== null && evenClas.card !== undefined) {
                if (get(evenClas.card, 'teacher')) {
                    evenArray[clasIndex].cards[evenDay.day] = {
                        card: evenClas.card,
                    };
                }
            }
        });
    });

    oddDaysPrepArray.forEach((oddDay) => {
        oddDay.class.forEach((oddClas, clasIndex) => {
            if (!get(oddArray, clasIndex)) {
                oddArray[clasIndex] = { class: oddClas.class, cards: {} };
            }

            daysUppercase.forEach((dayArr) => {
                if (!get(oddArray[clasIndex].cards, dayArr)) {
                    oddArray[clasIndex].cards[dayArr] = {};
                }
            });
            if (oddClas.card !== null && oddClas.card !== undefined) {
                if (get(oddClas.card, 'teacher')) {
                    oddArray[clasIndex].cards[oddDay.day] = {
                        card: oddClas.card,
                    };
                }
            }
        });
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

export const makeTeacherSchedule = (teacherSchedule) => {
    let teacher = {};
    const evenArray = [];
    const oddArray = [];
    const oddDays = [];
    const evenDays = [];
    const oddClasses = [];
    const evenClasses = [];

    if (teacherSchedule?.days) {
        const { teacher: teacherData } = teacherSchedule;
        teacher = teacherData;

        teacherSchedule.days.forEach((dayTeacher) => {
            dayTeacher.odd.classes.forEach((clas) => {
                if (oddClasses.findIndex((oddClass) => oddClass.id === clas.class.id) < 0) {
                    oddClasses.push(clas.class);
                }
                if (oddDays.indexOf(dayTeacher.day) < 0) {
                    oddDays.push(dayTeacher.day);
                }
                if (!(clas.class.id in oddArray)) {
                    oddArray[clas.class.id] = [];
                }

                oddArray[clas.class.id].push({
                    day: dayTeacher.day,
                    cards: clas.lessons,
                });
            });

            dayTeacher.even.classes.forEach((clas) => {
                if (evenClasses.findIndex((evenClass) => evenClass.id === clas.class.id) < 0) {
                    evenClasses.push(clas.class);
                }
                if (evenDays.indexOf(dayTeacher.day) < 0) {
                    evenDays.push(dayTeacher.day);
                }
                if (!(clas.class.id in evenArray)) {
                    evenArray[clas.class.id] = [];
                }

                evenArray[clas.class.id].push({
                    day: dayTeacher.day,
                    cards: clas.lessons,
                });
            });
        });
    }

    return {
        teacher,
        semester: teacherSchedule.semester,
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
