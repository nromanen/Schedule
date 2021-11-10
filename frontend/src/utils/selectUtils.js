import { getFirstLetter } from '../helper/renderTeacher';

export const getGroupsOptionsForSelect = (groupOptions) => {
    return groupOptions.map((item) => {
        return { id: item.id, value: item.id, label: `${item.title}` };
    });
};

export const setDepartmentOptions = (dep) => {
    return dep.map((item) => {
        return { id: item.id, value: item.id, label: `${item.name}` };
    });
};

export const setSemesterOptions = (semesters) => {
    return semesters !== undefined
        ? semesters.map((item) => {
              return { id: item.id, value: item.id, label: `${item.description}` };
          })
        : null;
};

export const setOptions = (enabledTeachers) => {
    return enabledTeachers.map((item) => {
        return {
            id: item.id,
            value: item.id,
            label: `${item.surname} ${getFirstLetter(item.name)} ${getFirstLetter(
                item.patronymic,
            )}`,
        };
    });
};
