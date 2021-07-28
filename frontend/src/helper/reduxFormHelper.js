
import { getTeacherForSite } from './renderTeacher';

export const setValueToTeacherForSiteHandler = (teachers, id, setValue) => {
    const teacher = teachers.find(teacher => teacher.id === +id);
    if (!teacher) setValue('teacherForSite', '');
    else setValue('teacherForSite', getTeacherForSite(teacher));
};

export const setValueToSubjectForSiteHandler = (subjects, subjectId, setValue) => {
    const subject = subjects.find(subject => subject.id === +subjectId);
    if (!subject) return setValue('subjectForSite', '');
    else setValue('subjectForSite', subject.name);
};
