import { call, takeEvery, put } from 'redux-saga/effects';
import { reset } from 'redux-form';
import * as actionTypes from '../actions/actionsType';
import i18n from '../i18n';
import { sortGroup } from '../helper/sortGroup';
import { GROUP_FORM } from '../constants/reduxForms';
import { setLoading } from '../actions/loadingIndicator';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import { FORM_GROUP_LABEL } from '../constants/translationLabels/formElements';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import {
    getDisabledGroupsApi,
    getEnabledGroupsApi,
    deleteGroupApi,
    createGroupApi,
    updateGroupApi,
} from '../services/group';
import {
    setDisabledGroups,
    showAllGroups,
    deleteGroup,
    updateGroup,
    selectGroup,
    clearGroup,
    addGroup,
} from '../actions';

function* fetchDisabledGroupsWorker() {
    try {
        yield put(setLoading(true));
        const res = yield call(getDisabledGroupsApi);
        yield put(setDisabledGroups(res.data.sort((a, b) => sortGroup(a, b))));
    } catch (err) {
        errorHandler(err);
    } finally {
        yield put(setLoading(false));
    }
}

function* fetchEnabledGroupsWorker() {
    try {
        yield put(setLoading(true));
        const res = yield call(getEnabledGroupsApi);
        yield put(showAllGroups(res.data.sort((a, b) => sortGroup(a, b))));
    } catch (err) {
        errorHandler(err);
    } finally {
        yield put(setLoading(false));
    }
}

function* deleteGroupWorker({ id }) {
    try {
        yield call(deleteGroupApi, id);
        yield put(deleteGroup(id));
        successHandler(
            i18n.t(BACK_END_SUCCESS_OPERATION, {
                cardType: i18n.t(FORM_GROUP_LABEL),
                actionType: i18n.t(DELETED_LABEL),
            }),
        );
    } catch (err) {
        errorHandler(err);
    }
}

function* createGroupWorker({ data }) {
    try {
        const res = yield call(createGroupApi, data);
        yield put(addGroup(res.data));
        yield put(reset(GROUP_FORM));
        successHandler(
            i18n.t(BACK_END_SUCCESS_OPERATION, {
                cardType: i18n.t(FORM_GROUP_LABEL),
                actionType: i18n.t(CREATED_LABEL),
            }),
        );
    } catch (err) {
        errorHandler(err);
    }
}

function* updateGroupWorker({ data }) {
    try {
        const res = yield call(updateGroupApi, data);
        yield put(updateGroup(res.data));
        yield put(selectGroup(null));
        yield put(reset(GROUP_FORM));
        successHandler(
            i18n.t(BACK_END_SUCCESS_OPERATION, {
                cardType: i18n.t(FORM_GROUP_LABEL),
                actionType: i18n.t(UPDATED_LABEL),
            }),
        );
    } catch (err) {
        errorHandler(err);
    }
}

function* clearGroupWorker() {
    try {
        yield put(clearGroup());
        yield put(reset(GROUP_FORM));
    } catch (err) {
        errorHandler(err);
    }
}

export default function* groupWatcher() {
    yield takeEvery(actionTypes.FETCH_DISABLED_GROUPS, fetchDisabledGroupsWorker);
    yield takeEvery(actionTypes.FETCH_ENABLED_GROUPS, fetchEnabledGroupsWorker);
    yield takeEvery(actionTypes.ASYNC_DELETE_GROUP, deleteGroupWorker);
    yield takeEvery(actionTypes.ASYNC_CREATE_GROUP, createGroupWorker);
    yield takeEvery(actionTypes.ASYNC_UPDATE_GROUP, updateGroupWorker);
    yield takeEvery(actionTypes.ASYNC_CLEAR_GROUP, clearGroupWorker);
}
