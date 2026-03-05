import Moment from 'moment';
import {extendMoment} from 'moment-range';
import {store} from '../store';
import i18n from '../i18n';
import {INTERSECT_TIME_ERROR_MESSAGE, UNIQUE_ERROR_MESSAGE,} from '../constants/translationLabels/validationMessages';

export const checkUniqClassName = (className, classes = [], currentClassId) => {
    let find = false;
    if (currentClassId) {
        find = classes.some(value => value.class_name === className && value.id !== currentClassId);
    } else {
        find = classes.some(value => value.class_name === className);
    }
    return find ? i18n.t(UNIQUE_ERROR_MESSAGE) : undefined;
};

export const timeIntersectService = (startTime, endTime, classes = [], currentClassId) => {
    const moment = extendMoment(Moment);
    let find = false;
    if (startTime && endTime) {
        const incomeRange = moment.range(
            moment(startTime, 'HH:mm').toDate(),
            moment(endTime, 'HH:mm').toDate(),
        );
        if (currentClassId) {
            find = classes.some((value) =>
                incomeRange.intersect(
                    moment.range(
                        moment(value.startTime, 'HH:mm').toDate(),
                        moment(value.endTime, 'HH:mm').toDate(),
                    ),
                ) !== null && value.id !== currentClassId
            );
        } else {
            find = classes.some((value) =>
                incomeRange.intersect(
                    moment.range(
                        moment(value.startTime, 'HH:mm').toDate(),
                        moment(value.endTime, 'HH:mm').toDate(),
                    ),
                ) !== null
            );
        }
    }
    return find ? i18n.t(INTERSECT_TIME_ERROR_MESSAGE) : undefined;
};

export const checkUniqLesson = (lessons, currentLesson) => {
    if (!currentLesson?.id) {
        return !lessons.find(
            (lesson) =>
                lesson.subject.id === +currentLesson.subject.id &&
                lesson.teacher.id === +currentLesson.teacher.id &&
                lesson.lessonType === currentLesson.lessonType,
        );
    }
    return !lessons.find(
        (lesson) =>
            lesson.subject.id === +currentLesson.subject.id &&
            lesson.teacher.id === +currentLesson.teacher.id &&
            lesson.lessonType === currentLesson.lessonType &&
            lesson.id !== +currentLesson.id,
    );
};

export const checkUniqueRoomName = (roomName) => {
    const roomdId = store.getState().rooms.oneRoom.id;
    let find = false;
    if (roomdId) {
        find = store.getState().rooms.rooms.some((value) => {
            return value.name.toUpperCase() === roomName.toUpperCase() && value.id !== roomdId;
        });
    } else {
        find = store.getState().rooms.rooms.some((value) => {
            return value.name.toUpperCase() === roomName.toUpperCase();
        });
    }
    return find ? i18n.t(UNIQUE_ERROR_MESSAGE) : undefined;
};

export const checkUniqueGroup = (groupTitle) => {
    if (!groupTitle) {
        return undefined;
    }
    const find = store.getState().groups.groups.some((value) => {
        return value.title.toUpperCase().trim() === groupTitle.toUpperCase().trim();
    });
    return find ? i18n.t(UNIQUE_ERROR_MESSAGE) : undefined;
};

export const checkUniqueSubject = (subjectTitle) => {
    if (!subjectTitle) {
        return undefined;
    }
    const find = store.getState().subjects.subjects.some((value) => {
        return value.name.toUpperCase().trim() === subjectTitle.toUpperCase().trim();
    });
    return find ? i18n.t(UNIQUE_ERROR_MESSAGE) : undefined;
};

export const checkUniqueDepartment = (value, departments, currentId) => {
    const isDuplicate = departments.some(
        (dept) => dept.name.trim().toLowerCase() === value.trim().toLowerCase() && dept.id !== currentId
    );
    return isDuplicate ? i18n.t('Name must be unique') : true;
};

export const checkUniqSemester = (semester) => {
    const { semesters } = store.getState().semesters;
    let isNotUnique;
    if (!semester.id) {
        isNotUnique = !!semesters.find(
            (storeSemester) =>
                storeSemester.year === +semester.year &&
                storeSemester.description.toUpperCase().trim() ===
                    semester.description.toUpperCase().trim(),
        );
    } else {
        isNotUnique = !!semesters.find(
            (storeSemester) =>
                storeSemester.year === +semester.year &&
                storeSemester.description.toUpperCase().trim() ===
                    semester.description.toUpperCase().trim() &&
                storeSemester.id !== +semester.id,
        );
    }

    return !isNotUnique;
};
