export const handleTeacherInfo = (teacher) => {
    return `${teacher.surname} ${teacher.name} ${teacher.patronymic}(${teacher.position})`;
};

export const handleTeacherShortInfo = (teacher) => {
    return `${teacher.position} ${teacher.surname} ${teacher.name.split('')[0]}.${
        teacher.patronymic.split('')[0]
    }.`;
};
