import { takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../../actions/actionsType';
import { getCurrentSemester } from './getCurrentSemester';

export default function* watchSchedule() {
    yield takeLatest(actionTypes.GET_CURRENT_SEMESTER_REQUESTED, getCurrentSemester);
}
