import { get } from 'lodash';

export const getScheduleType = (values) => {
    const { group, teacher } = values;
    if (get(group, 'id')) {
        return 'group';
    }
    if (get(teacher, 'id')) {
        return 'teacher';
    }
    return 'full';
};
