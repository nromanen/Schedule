import { handleTeacherShortInfo } from './handleTeacherInfo';

export const setValueToTeacherForSiteHandler = (teachers, id, setValue) => {
    console.log("GJHFDSsetValueToTeacherForSiteHandler",teacher)
    const teacher = teachers.find(teacher => teacher.id === +id);
    console.log("setValueToTeacherForSiteHandler",teacher)
    if (!teacher) setValue('teacherForSite', '');
    else setValue('teacherForSite', handleTeacherShortInfo(teacher));
};

export const setValueToSubjectForSiteHandler = (subjects, subjectId, setValue) => {
    const subject = subjects.find(subject => subject.id === +subjectId);
    if (!subject) return setValue('subjectForSite', '');
    else setValue('subjectForSite', subject.name);
};
