import { all } from 'redux-saga/effects';
import { watchSemester } from './semesters';
import watchUserAuthentication from './watchers';

export default function* startForman() {
    yield all([watchUserAuthentication(), watchSemester()]);
}
