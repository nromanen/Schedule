import { all } from 'redux-saga/effects';
import groupWatcher from './group';
import watchUserAuthentication from './watchers';

export default function* startForman() {
    yield all([watchUserAuthentication(), groupWatcher()]);
}
