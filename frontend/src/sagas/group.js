import { call, takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionsType';
import i18n from '../i18n';
import { sortGroup } from '../helper/sortGroup';
import { GROUP_FORM } from '../constants/reduxForms';
import { resetFormHandler } from '../helper/formHelper';
import { setLoading } from '../actions/loadingIndicator';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import { setDisabledGroups, showAllGroups, deleteGroup, addGroup } from '../actions';
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
} from '../services/groupService';

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
        resetFormHandler(GROUP_FORM);
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
        const res = yield call(createGroupApi, data);
        yield put(addGroup(res.data));
        resetFormHandler(GROUP_FORM);
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

export default function* groupWatcher() {
    yield takeEvery(actionTypes.FETCH_DISABLED_GROUPS, fetchDisabledGroupsWorker);
    yield takeEvery(actionTypes.FETCH_ENABLED_GROUPS, fetchEnabledGroupsWorker);
    yield takeEvery(actionTypes.ASYNC_DELETE_GROUP, deleteGroupWorker);
    yield takeEvery(actionTypes.ASYNC_CREATE_GROUP, createGroupWorker);
}
