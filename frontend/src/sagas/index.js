import { all } from 'redux-saga/effects';
import watchLessons from './lessons';
import watchUserAuthentication from './watchers';

export default function* startForman() {
    yield all([watchUserAuthentication(), watchLessons()]);
}
