import { call, takeEvery, put, select, takeLatest } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { has } from 'lodash';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import i18n from '../i18n';
import { GROUP_FORM } from '../constants/reduxForms';
import * as actionTypes from '../actions/actionsType';
import { setLoading } from '../actions/loadingIndicator';
import { FORM_GROUP_LABEL } from '../constants/translationLabels/formElements';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import {
    showAllGroups,
    deleteGroupSusses,
    updateGroupSusses,
    selectGroup,
    clearGroupSusses,
    addGroup,
} from '../actions';
import { DISABLED_GROUPS_URL, GROUP_URL } from '../constants/axios';
import { axiosCall } from '../services/axios';

function* fetchGroups(url) {
    try {
        yield put(showAllGroups([]));
        yield put(setLoading(true));
        const res = yield call(axiosCall, url);
        yield put(showAllGroups(res.data));
    } catch (err) {
        errorHandler(err);
    } finally {
        yield put(setLoading(false));
    }
}

function* fetchDisabledGroups() {
    yield call(fetchGroups, DISABLED_GROUPS_URL);
}

function* fetchEnabledGroups() {
    yield call(fetchGroups, GROUP_URL);
}

function* createGroup({ data }) {
    try {
        const res = yield call(axiosCall, GROUP_URL, 'POST', data);
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

function* updateGroup({ data }) {
    try {
        const res = yield call(axiosCall, GROUP_URL, 'PUT', data);
        if (has(data, 'disable')) {
            yield put(deleteGroupSusses(data.id));
        } else {
            yield put(updateGroupSusses(res.data));
        }
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

function* submitGroupForm() {
    try {
        const state = yield select();
        const { values } = state.form.addGroup;
        if (!values.id) {
            yield call(createGroup, { data: values });
        } else {
            yield call(updateGroup, { data: values });
        }
    } catch (err) {
        errorHandler(err);
    }
}

function* deleteGroup({ id }) {
    try {
        yield call(axiosCall, `${GROUP_URL}/${id}`, 'DELETE');
        yield put(deleteGroupSusses(id));
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

function* toggleDisabledGroup({ groupId, disabledStatus }) {
    try {
        if (groupId) {
            const state = yield select();
            const group = state.groups.groups.find((item) => item.id === groupId);
            yield call(updateGroup, { data: { ...group, disable: !disabledStatus } });
        }
    } catch (err) {
        errorHandler(err);
    }
}

function* clearGroup() {
    try {
        yield put(clearGroupSusses());
        yield put(reset(GROUP_FORM));
    } catch (err) {
        errorHandler(err);
    }
}

export default function* groupWatcher() {
    yield takeEvery(actionTypes.TOGGLE_DISABLED_STATUS_GROUP, toggleDisabledGroup);
    yield takeLatest(actionTypes.FETCH_DISABLED_GROUPS_START, fetchDisabledGroups);
    yield takeLatest(actionTypes.FETCH_ENABLED_GROUPS_START, fetchEnabledGroups);
    yield takeEvery(actionTypes.DELETE_GROUP_START, deleteGroup);
    yield takeEvery(actionTypes.SUBMIT_GROUP_START, submitGroupForm);
    // yield takeEvery(actionTypes.UPDATE_GROUP_START, updateGroup);
    yield takeEvery(actionTypes.CLEAR_GROUP_START, clearGroup);
}
