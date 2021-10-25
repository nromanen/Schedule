import { all } from 'redux-saga/effects';
import watchSchedule from './schedule/watcher';
import watchUserAuthentication from './watchers';

export default function* startForman() {
    yield all([watchUserAuthentication(), watchSchedule()]);
}
