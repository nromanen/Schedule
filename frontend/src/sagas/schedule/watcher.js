import { takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../../actions/actionsType';
import { checkScheduleItemAvailability } from './checkScheduleItemAvailability';
import { getCurrentSemester } from './getCurrentSemester';
import { getDefaultSemester } from './getDefaultSemester';

export default function* watchSchedule() {
    yield takeLatest(actionTypes.GET_CURRENT_SEMESTER_REQUESTED, getCurrentSemester);
    yield takeLatest(actionTypes.GET_DEFAULT_SEMESTER_REQUESTED, getDefaultSemester);
    yield takeLatest(
        actionTypes.CHECK_AVAILABILITY_SCHEDULE_REQUESTED,
        checkScheduleItemAvailability,
    );
}
