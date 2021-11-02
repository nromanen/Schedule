import { call, takeEvery, put, select, takeLatest } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { has } from 'lodash';
import { GROUP_FORM } from '../constants/reduxForms';
import * as actionTypes from '../actions/actionsType';
import { setLoading } from '../actions/loadingIndicator';
import { createErrorMessage, createDynamicMessage } from '../utils/sagaUtils';
import { setOpenSuccessSnackbar, setOpenErrorSnackbar } from '../actions/snackbar';
import {
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import {
    showAllGroups,
    deleteGroupSuccess,
    updateGroupSuccess,
    selectGroup,
    clearGroupSuccess,
    addGroup,
} from '../actions';
import { DISABLED_GROUPS_URL, GROUP_URL } from '../constants/axios';
import { axiosCall } from '../services/axios';
import { DELETE, POST, PUT } from '../constants/methods';

function* fetchGroups(url) {
    try {
        yield put(showAllGroups([]));
        yield put(setLoading(true));
        const res = yield call(axiosCall, url);
        yield put(showAllGroups(res.data));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
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
        const res = yield call(axiosCall, GROUP_URL, POST, data);
        yield put(addGroup(res.data));
        yield put(reset(GROUP_FORM));
        const message = createDynamicMessage('group', CREATED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* updateGroup({ data }) {
    try {
        console.log(data);
        const res = yield call(axiosCall, GROUP_URL, PUT, data);
        if (has(data, 'disable')) {
            yield put(deleteGroupSuccess(data.id));
        } else {
            yield put(updateGroupSuccess(res.data));
        }
        yield put(selectGroup(null));
        yield put(reset(GROUP_FORM));
        const message = createDynamicMessage('group', UPDATED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
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
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* deleteGroup({ id }) {
    try {
        const requestUrl = `${GROUP_URL}/${id}`;
        yield call(axiosCall, requestUrl, DELETE);
        yield put(deleteGroupSuccess(id));
        const message = createDynamicMessage('group', DELETED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
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
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* clearGroup() {
    try {
        yield put(clearGroupSuccess());
        yield put(reset(GROUP_FORM));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
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
