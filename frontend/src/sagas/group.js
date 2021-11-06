import { call, takeEvery, put, select, takeLatest } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { has } from 'lodash';
import i18n from '../i18n';
import { GROUP_FORM } from '../constants/reduxForms';
import * as actionTypes from '../actions/actionsType';
import { setLoading } from '../actions/loadingIndicator';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import {
    FORM_CHOSEN_SEMESTER_LABEL,
    FORM_GROUP_LABEL,
} from '../constants/translationLabels/formElements';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
    CHOSEN_SEMESTER_HAS_NOT_GROUPS,
    SERVICE_MESSAGE_GROUP_LABEL,
} from '../constants/translationLabels/serviceMessages';
import {
    showAllGroups,
    deleteGroupSusses,
    updateGroupSusses,
    selectGroup,
    clearGroupSusses,
    addGroup,
} from '../actions';
import { DISABLED_GROUPS_URL, GROUPS_URL, GROUP_URL, SEMESTERS_URL } from '../constants/axios';
import { axiosCall } from '../services/axios';
import { setOpenErrorSnackbar, setOpenInfoSnackbar } from '../actions/snackbar';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';

function* fetchDisabledGroups() {
    try {
        yield put(showAllGroups([]));
        yield put(setLoading(true));
        const res = yield call(axiosCall, DISABLED_GROUPS_URL, 'GET');
        yield put(showAllGroups(res.data));
    } catch (err) {
        errorHandler(err);
    } finally {
        yield put(setLoading(false));
    }
}

function* fetchEnabledGroups() {
    try {
        yield put(showAllGroups([]));
        yield put(setLoading(true));
        const res = yield call(axiosCall, GROUP_URL, 'GET');
        yield put(showAllGroups(res.data));
    } catch (err) {
        errorHandler(err);
    } finally {
        yield put(setLoading(false));
    }
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

export function* getAllPublicGroups({ id }) {
    try {
        const requestUrl = `/${SEMESTERS_URL}/${id}/${GROUPS_URL}`;
        const { data } = yield call(axiosCall, requestUrl);
        yield put(showAllGroups(data));
        if (data.length === 0) {
            const message = createMessage(
                CHOSEN_SEMESTER_HAS_NOT_GROUPS,
                FORM_CHOSEN_SEMESTER_LABEL,
                SERVICE_MESSAGE_GROUP_LABEL,
            );
            yield put(setOpenInfoSnackbar(message));
        }
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export default function* groupWatcher() {
    yield takeEvery(actionTypes.TOGGLE_DISABLED_STATUS_GROUP, toggleDisabledGroup);
    yield takeLatest(actionTypes.FETCH_DISABLED_GROUPS_START, fetchDisabledGroups);
    yield takeLatest(actionTypes.FETCH_ENABLED_GROUPS_START, fetchEnabledGroups);
    yield takeEvery(actionTypes.DELETE_GROUP_START, deleteGroup);
    yield takeEvery(actionTypes.CREATE_GROUP_START, createGroup);
    yield takeEvery(actionTypes.UPDATE_GROUP_START, updateGroup);
    yield takeEvery(actionTypes.CLEAR_GROUP_START, clearGroup);
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_GROUPS_START, getAllPublicGroups);
}
