import { isEmpty } from 'lodash';

export const divideLessonsByOneHourLesson = (items, lessons) => {
    const lessonItem = [];
    lessons.forEach((lesson) => {
        let filteredLesson = [];
        const modifiedLesson = lesson;
        const { hours } = modifiedLesson;

        if (!isEmpty(items)) {
            filteredLesson = items.filter((item) => item.lesson.id === lesson.id);
        }

        for (let i = 0; i < hours - filteredLesson.length; i += 1) {
            lessonItem.push(modifiedLesson);
        }
    });
    return lessonItem;
};
