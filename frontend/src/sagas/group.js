import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionsType';
import { setLoading } from '../actions/loadingIndicator';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';
import { setOpenErrorSnackbar, setOpenInfoSnackbar } from '../actions/snackbar';
import { GROUPS_URL, SEMESTERS_URL, GROUPS_FOR_CURRENT_SCHEDULE } from '../constants/axios';
import { axiosCall } from '../services/axios';
import { FORM_CHOSEN_SEMESTER_LABEL } from '../constants/translationLabels/formElements';
import {
    CHOSEN_SEMESTER_HAS_NOT_GROUPS,
    SERVICE_MESSAGE_GROUP_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { showAllGroupsSuccess, setScheduleGroups } from '../actions';

function* getGroupsForCurrentSemester() {
    try {
        yield put(setLoading(true));
        const res = yield call(axiosCall, GROUPS_FOR_CURRENT_SCHEDULE);
        yield put(setScheduleGroups(res.data));
    } catch (err) {
        yield put(setOpenErrorSnackbar(createErrorMessage(err)));
    } finally {
        yield put(setLoading(false));
    }
}

export function* getAllPublicGroups({ id }) {
    try {
        const requestUrl = `/${SEMESTERS_URL}/${id}/${GROUPS_URL}`;
        const { data } = yield call(axiosCall, requestUrl);
        yield put(showAllGroupsSuccess(data));
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
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_GROUPS_START, getAllPublicGroups);
    yield takeLatest(actionTypes.GET_GROUPS_FOR_CURRENT_SEMESTER_START, getGroupsForCurrentSemester);
}