// frontend/src/helper/getScheduleType.js
import {get} from 'lodash';
import {FULL, GROUP, TEACHER, DEPARTMENT} from '../constants/scheduleTypes';

export const getScheduleType = (values) => {
    const { group, teacher, department } = values;
    if (get(group, 'id')) {
        return GROUP;
    }
    if (get(teacher, 'id')) {
        return TEACHER;
    }
    if (get(department, 'id')) {
        return DEPARTMENT;
    }
    return FULL;
};