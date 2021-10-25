import { get } from 'lodash';
import {
    getFullSchedule,
    getGroupSchedule,
    getTeacherSchedule,
    setScheduleGroupIdService,
    setScheduleSemesterIdService,
    setScheduleTeacherIdService,
    setScheduleTypeService,
} from '../services/scheduleService';

export const submitSearchSchedule = (values) => {
    setScheduleSemesterIdService(values.semester);
    if (values.group > 0) {
        setScheduleTypeService('group');
        setScheduleGroupIdService(values.group);
        getGroupSchedule(values.group, values.semester);

        return;
    }
    if (values.teacher > 0) {
        setScheduleTypeService('teacher');
        setScheduleTeacherIdService(values.teacher);
        getTeacherSchedule(values.teacher, values.semester);
        return;
    }
    if (
        (values.teacher === 0 && values.group === 0) ||
        (!get(values, 'group') && values.teacher === 0) ||
        (!get(values, 'teacher') && values.group === 0) ||
        (!get(values, 'group') && !get(values, 'teacher'))
    ) {
        setScheduleTypeService('full');
        getFullSchedule(values.semester);
    }
};
