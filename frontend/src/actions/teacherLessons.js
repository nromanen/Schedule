import * as actionsType from './actionsType';

export const getLessonsByTeacherStart = (teacherId) => ({
    type: actionsType.GET_LESSONS_BY_TEACHER_START,
    teacherId,
});

export const getLessonsByTeacherSuccess = (lessons, teacher) => ({
    type: actionsType.GET_LESSONS_BY_TEACHER_SUCCESS,
    lessons,
    teacher,
});

export const updateLessonLinkStart = (lessonId, link) => ({
    type: actionsType.UPDATE_LESSON_LINK_START,
    lessonId,
    link,
});

export const updateLessonLinkSuccess = (lesson) => ({
    type: actionsType.UPDATE_LESSON_LINK_SUCCESS,
    lesson,
});

export const clearTeacherLessons = () => ({
    type: actionsType.CLEAR_TEACHER_LESSONS,
});

export const setTeacherLessonsLoading = (loading) => ({
    type: actionsType.SET_TEACHER_LESSONS_LOADING,
    loading,
});

export const updateLessonsLinkStart = (linkData) => ({
    type: actionsType.UPDATE_LESSONS_LINK_START,
    linkData,
});

export const updateLessonsLinkSuccess = (lessons) => ({
    type: actionsType.UPDATE_LESSONS_LINK_SUCCESS,
    lessons,
});