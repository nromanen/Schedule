import { store } from '../store';

export const semesterFormValueMapper = (semester) => {
    const semesterDays = [];
    const semesterClasses = [];
    Object.keys(semester).forEach((prop) => {
        if (prop.indexOf('semester_days_markup_') >= 0 && semester[prop] === true) {
            semesterDays.push(prop.substring(21));
        }
        if (prop.indexOf('semester_classes_markup_') >= 0 && semester[prop] === true) {
            semesterClasses.push(
                store
                    .getState()
                    .classActions.classScheduler.find(
                        (schedule) => schedule.id === +prop.substring(24),
                    ),
            );
        }
    });

    return {
        id: semester.id,
        year: +semester.year,
        description: semester.description,
        startDay: semester.startDay,
        endDay: semester.endDay,
        currentSemester: semester.currentSemester,
        defaultSemester: semester.defaultSemester,
        semester_days: semesterDays,
        semester_classes: semesterClasses,
        semester_groups: semester.semester_groups,
    };
};
