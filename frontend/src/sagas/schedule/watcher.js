import { takeLatest, takeEvery } from 'redux-saga/effects';
import * as actionTypes from '../../actions/actionsType';
import { addItemsToSchedule } from './addItemsToSchedule';
import { checkAvailabilityChangeRoomSchedule } from './checkAvailabilityChangeRoomSchedule';
import { checkScheduleItemAvailability } from './checkScheduleItemAvailability';
import { clearSchedule } from './clearSchedule';
import { deleteScheduleItem } from './deleteScheduleItem';
import { editRoomItemToSchedule } from './editRoomItemToSchedule';
import { getAllPublicGroups } from './getAllPublicGroups';
import { getAllPublicSemesters } from './getAllPublicSemesters';
import { getAllPublicTeachers } from './getAllPublicTeachers';
import { getAllPublicTeachersByDepartment } from './getAllPublicTeachersByDepartment';
import { getCurrentSemester } from './getCurrentSemester';
import { getDefaultSemester } from './getDefaultSemester';
import { getFullSchedule } from './getFullSchedule';
import { getGroupSchedule } from './getGroupSchedule';
import { getScheduleItems } from './getScheduleItems';
import { getScheduleItemsBySemester } from './getScheduleItemsBySemester';
import { getTeacherRangeSchedule } from './getTeacherRangeSchedule';
import { getTeacherSchedule } from './getTeacherSchedule';
import { sendTeacherSchedule } from './sendTeacherSchedule';

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
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_TEACHERS_REQUESTED, getAllPublicTeachers);
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_GROUPS_REQUESTED, getAllPublicGroups);
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_SEMESTERS_REQUESTED, getAllPublicSemesters);
    yield takeLatest(actionTypes.SEND_TEACHER_SCHEDULE_REQUESTED, sendTeacherSchedule);
    yield takeLatest(actionTypes.GET_TEACHER_RANGE_SCHEDULE_REQUESTED, getTeacherRangeSchedule);
    yield takeLatest(actionTypes.GET_ALL_SCHEDULE_ITEMS_REQUESTED, getScheduleItems);
    yield takeEvery(actionTypes.ADD_ITEM_TO_SCHEDULE_REQUESTED, addItemsToSchedule);
    yield takeEvery(actionTypes.EDIT_ITEM_TO_SCHEDULE_REQUESTED, editRoomItemToSchedule);
    yield takeEvery(actionTypes.DELETE_SCHEDULE_ITEM_REQUESTED, deleteScheduleItem);
    yield takeEvery(actionTypes.CLEAR_SCHEDULE_REQUESTED, clearSchedule);
    yield takeLatest(actionTypes.GET_GROUP_SCHEDULE_REQUESTED, getGroupSchedule);
    yield takeLatest(actionTypes.GET_TEACHER_SCHEDULE_REQUESTED, getTeacherSchedule);
    yield takeLatest(actionTypes.GET_FULL_SCHEDULE_REQUESTED, getFullSchedule);
}
