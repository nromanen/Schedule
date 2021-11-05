import { call, takeEvery, put, select, takeLatest } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { has } from 'lodash';
import { GROUP_FORM } from '../constants/reduxForms';
import * as actionTypes from '../actions/actionsType';
import { setLoading } from '../actions/loadingIndicator';
import { createErrorMessage, createDynamicMessage } from '../utils/sagaUtils';
import { setOpenSuccessSnackbar, setOpenErrorSnackbar } from '../actions/snackbar';
import { DISABLED_GROUPS_URL, GROUP_URL } from '../constants/axios';
import { DELETE, POST, PUT } from '../constants/methods';
import { axiosCall } from '../services/axios';
import {
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import {
    fetchGroupByIdSuccess,
    showAllGroupsSuccess,
    deleteGroupSuccess,
    updateGroupSuccess,
    selectGroupSuccess,
    clearGroupSuccess,
    createGroupSuccess,
} from '../actions';
import { hasDisabled } from '../constants/disabledCard';
import { GROUP } from '../constants/names';

function* fetchGroups(url) {
    try {
        yield put(showAllGroupsSuccess([]));
        yield put(setLoading(true));
        const res = yield call(axiosCall, url);
        yield put(showAllGroupsSuccess(res.data));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    } finally {
        yield put(setLoading(false));
    }
}

function* fetchGroupById({ id }) {
    try {
        yield put(selectGroupSuccess({}));
        const res = yield call(axiosCall, `${GROUP_URL}${id}`);
        yield put(fetchGroupByIdSuccess(res.data));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
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
        yield put(createGroupSuccess(res.data));
        yield put(reset(GROUP_FORM));
        const message = createDynamicMessage(GROUP, CREATED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* updateGroup({ data }) {
    try {
        const res = yield call(axiosCall, GROUP_URL, PUT, data);
        if (has(data, hasDisabled)) {
            yield put(deleteGroupSuccess(data.id));
        } else {
            yield put(updateGroupSuccess(res.data));
        }
        yield put(selectGroupSuccess(null));
        const message = createDynamicMessage(GROUP, UPDATED_LABEL);
        yield put(setOpenSuccessSnackbar(message));
        yield put(reset(GROUP_FORM));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* submitGroupForm({ group }) {
    try {
        if (!group.id) {
            yield call(createGroup, { data: group });
        } else {
            yield call(updateGroup, { data: group });
        }
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    }
}

function* deleteGroup({ id }) {
    try {
        yield call(axiosCall, `${GROUP_URL}/${id}`, DELETE);
        yield put(deleteGroupSuccess(id));
        const message = createDynamicMessage(GROUP, DELETED_LABEL);
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
    yield takeEvery(actionTypes.FETCH_GROUP_BY_ID_START, fetchGroupById);
    yield takeEvery(actionTypes.SUBMIT_GROUP_START, submitGroupForm);
    yield takeEvery(actionTypes.DELETE_GROUP_START, deleteGroup);
    yield takeEvery(actionTypes.CLEAR_GROUP_START, clearGroup);
}
