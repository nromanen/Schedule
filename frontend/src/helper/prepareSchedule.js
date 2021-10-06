import { daysUppercase } from '../constants/schedule/days';

export const makeGroupSchedule = (groupSchedule) => {
    const evenArray = [];
    const oddArray = [];
    let group = {};
    let done = false;

    const evenDaysPrepArray = [
        { day: 'MONDAY', class: [] },
        { day: 'TUESDAY', class: [] },
        { day: 'WEDNESDAY', class: [] },
        { day: 'THURSDAY', class: [] },
        { day: 'FRIDAY', class: [] },
        { day: 'SATURDAY', class: [] },
        { day: 'SUNDAY', class: [] },
    ];
    const oddDaysPrepArray = [
        { day: 'MONDAY', class: [] },
        { day: 'TUESDAY', class: [] },
        { day: 'WEDNESDAY', class: [] },
        { day: 'THURSDAY', class: [] },
        { day: 'FRIDAY', class: [] },
        { day: 'SATURDAY', class: [] },
        { day: 'SUNDAY', class: [] },
    ];

    if (groupSchedule.schedule && groupSchedule.schedule.length > 0) {
        group = groupSchedule.schedule[0].group;
        groupSchedule.schedule[0].days.map((day) => {
            day.classes.map((classItem) => {
                evenDaysPrepArray.map((evenDayPrep) => {
                    if (evenDayPrep.day === day.day) {
                        evenDayPrep.class[classItem.class.id] = {
                            class: classItem.class,
                            card: classItem.weeks.even,
                        };
                    }
                });

                oddDaysPrepArray.map((oddDayPrep) => {
                    if (oddDayPrep.day === day.day) {
                        oddDayPrep.class[classItem.class.id] = {
                            class: classItem.class,
                            card: classItem.weeks.odd,
                        };
                    }
                });
            });
        });
    }

    oddDaysPrepArray.map((oddDay) => {
        oddDay.class.map((oddClas, clasIndex) => {
            if (!oddArray.hasOwnProperty(clasIndex)) {
                oddArray[clasIndex] = { class: oddClas.class, cards: {} };
            }

            daysUppercase.map((dayArr) => {
                if (!oddArray[clasIndex].cards.hasOwnProperty(dayArr)) {
                    oddArray[clasIndex].cards[dayArr] = {};
                }
            });
            if (oddClas.card !== null && oddClas.card !== undefined) {
                // if (oddClas.card.hasOwnProperty('teacherForSite')) {
                if (oddClas.card.hasOwnProperty('teacher')) {
                    oddArray[clasIndex].cards[oddDay.day] = {
                        card: oddClas.card,
                    };
                }
            }
        });
    });

    evenDaysPrepArray.map((evenDay) => {
        evenDay.class.map((evenClas, clasIndex) => {
            if (!evenArray.hasOwnProperty(clasIndex)) {
                evenArray[clasIndex] = { class: evenClas.class, cards: {} };
            }

            daysUppercase.map((dayArr) => {
                if (!evenArray[clasIndex].cards.hasOwnProperty(dayArr)) {
                    evenArray[clasIndex].cards[dayArr] = {};
                }
            });
            if (evenClas.card !== null && evenClas.card !== undefined) {
                // if (evenClas.card.hasOwnProperty('teacherForSite')) {
                if (evenClas.card.hasOwnProperty('teacher')) {
                    evenArray[clasIndex].cards[evenDay.day] = {
                        card: evenClas.card,
                    };
                }
            }
        });
    });
    done = true;
    return {
        semester: groupSchedule.semester,
        oddArray,
        evenArray,
        group,
        done,
    };
};

export const makeFullSchedule = (fullSchedule) => {
    let groupsCount = 0;
    let groupList = [];
    const groupListId = new Map([]);
    const daysPrepArrayFull = [];
    let done = false;
    let semester_days = [];
    let semester_classes = [];

    if (fullSchedule.schedule) {
        groupsCount = fullSchedule.schedule.length;
        semester_days = fullSchedule.semester.semester_days;
        semester_classes = fullSchedule.semester.semester_classes;

        fullSchedule.schedule.map((group) => {
            groupList.push(group.group);
            groupListId.set(group.group.id, {});
        });
        groupList = groupList.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));

        fullSchedule.semester.semester_days.map((day) => {
            const prep_schedule_array = [];
            fullSchedule.semester.semester_classes.map((classItem) => {
                const oddArray = [];
                const evenArray = [];
                groupList.forEach((groupItem, groupIndex) => {
                    const groupFull = fullSchedule.schedule.find(
                        (groupFullIterate) => groupFullIterate.group.id === groupItem.id,
                    );
                    const dayFull = groupFull.days.find(
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
                prep_schedule_array.push({
                    class: classItem,
                    cards: { odd: oddArray, even: evenArray },
                });
            });
            daysPrepArrayFull.push({ day, classes: prep_schedule_array });
        });
        done = true;
    }

    return {
        semester: fullSchedule.semester,
        schedule: fullSchedule.schedule,
        semester_classes,
        semester_days,
        groupsCount,
        groupList,
        resultArray: daysPrepArrayFull,
        done,
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
    let done = false;

    if (teacherSchedule && teacherSchedule.days) {
        teacher = teacherSchedule.teacher;

        teacherSchedule.days.map((dayTeacher) => {
            dayTeacher.odd.classes.map((clas) => {
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

            dayTeacher.even.classes.map((clas) => {
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
        done = true;
    }

    return {
        done,
        teacher,
        semester: teacherSchedule.semester,
        odd: {
            days: oddDays,
            classes: oddClasses.sort((a, b) =>
                a.startTime > b.startTime ? 1 : b.startTime > a.startTime ? -1 : 0,
            ),
            cards: oddArray,
        },
        even: {
            days: evenDays,
            classes: evenClasses.sort((a, b) =>
                a.startTime > b.startTime ? 1 : b.startTime > a.startTime ? -1 : 0,
            ),
            cards: evenArray,
        },
    };
};
