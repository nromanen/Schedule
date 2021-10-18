export const search = (items, term, arr) => {
    if (term.length === 0) return items;

    return items.filter((item) => {
        for (let i = 0; i < arr.length; i += 1) {
            if (String(item[arr[i]]).toLowerCase().indexOf(term.toLowerCase()) > -1) return true;
        }
        return false;
    });
};

export const searchLessonsByTeacher = (lessons, term) => {
    const isIncludeValue = (item, value) => {
        return item.toLowerCase().includes(value.toLowerCase());
    };
    const termTmp = term.trim();
    if (termTmp.length === 0) return lessons;
    return lessons.filter((lesson) => {
        const { teacher, subjectForSite, lessonType, grouped } = lesson;
        return (
            isIncludeValue(teacher.surname, termTmp) ||
            isIncludeValue(subjectForSite, termTmp) ||
            isIncludeValue(lessonType, termTmp) ||
            (isIncludeValue('Grouped', term) && grouped)
        );
    });
};
