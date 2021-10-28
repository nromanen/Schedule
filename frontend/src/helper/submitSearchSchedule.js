import { get } from 'lodash';

export const submitSearchSchedule = (values, actionCalls) => {
    const {
        setSemesterId,
        setTypeOfSchedule,
        setGroupId,
        getGroupSchedule,
        setTeacherId,
        getTeacherSchedule,
        getFullSchedule,
    } = actionCalls;

    setSemesterId(values.semester);
    if (values.group > 0) {
        setTypeOfSchedule('group');
        setGroupId(values.group);
        getGroupSchedule(values.group, values.semester);

        return;
    }
    if (values.teacher > 0) {
        setTypeOfSchedule('teacher');
        setTeacherId(values.teacher);
        getTeacherSchedule(values.teacher, values.semester);
        return;
    }
    if (
        (values.teacher === 0 && values.group === 0) ||
        (!get(values, 'group') && values.teacher === 0) ||
        (!get(values, 'teacher') && values.group === 0) ||
        (!get(values, 'group') && !get(values, 'teacher'))
    ) {
        setTypeOfSchedule('full');
        getFullSchedule(values.semester);
    }
};
