import { all } from 'redux-saga/effects';
import { watchSemester } from './semesters';
import groupWatcher from './group';
import studentWatcher from './student';
import watchUserAuthentication from './watchers';
import watchLessons from './lessons';

export default function* startForman() {
    yield all([
        watchUserAuthentication(),
        studentWatcher(),
        groupWatcher(),
        watchSemester(),
        watchLessons(),
    ]);
}
