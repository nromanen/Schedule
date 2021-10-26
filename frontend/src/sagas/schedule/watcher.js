import { takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../../actions/actionsType';
import { checkAvailabilityChangeRoomSchedule } from './checkAvailabilityChangeRoomSchedule';
import { checkScheduleItemAvailability } from './checkScheduleItemAvailability';
import { getAllPublicTeachersByDepartment } from './getAllPublicTeachersByDepartment';
import { getCurrentSemester } from './getCurrentSemester';
import { getDefaultSemester } from './getDefaultSemester';
import { getScheduleItemsBySemester } from './getScheduleItemsBySemester';

export default function* watchSchedule() {
    yield takeLatest(actionTypes.GET_CURRENT_SEMESTER_REQUESTED, getCurrentSemester);
    yield takeLatest(actionTypes.GET_DEFAULT_SEMESTER_REQUESTED, getDefaultSemester);
    yield takeLatest(
        actionTypes.CHECK_AVAILABILITY_SCHEDULE_REQUESTED,
        checkScheduleItemAvailability,
    );
    yield takeLatest(actionTypes.GET_SCHEDULE_ITEMS_REQUESTED, getScheduleItemsBySemester);
    yield takeLatest(
        actionTypes.CHECK_AVAILABILITY_CHANGE_ROOM_SCHEDULE_REQUESTED,
        checkAvailabilityChangeRoomSchedule,
    );
    yield takeLatest(
        actionTypes.GET_ALL_PUBLIC_TEACHERS_BY_DEPARTMENT_REQUESTED,
        getAllPublicTeachersByDepartment,
    );
}
