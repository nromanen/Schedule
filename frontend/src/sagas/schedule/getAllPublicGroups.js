import { call, put } from 'redux-saga/effects';
import { setOpenSnackbar, showAllGroups } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { GROUPS_URL, SEMESTERS_URL } from '../../constants/axios';
import { sortGroup } from '../../services/groupService';
import {
    CHOSEN_SEMESTER_HAS_NOT_GROUPS,
    SERVICE_MESSAGE_GROUP_LABEL,
} from '../../constants/translationLabels/serviceMessages';
import { FORM_CHOSEN_SEMESTER_LABEL } from '../../constants/translationLabels/formElements';

export function* getAllPublicGroups({ id }) {
    try {
        if (id !== null && id !== undefined) {
            const requestUrl = `/${SEMESTERS_URL}/${id}/${GROUPS_URL}`;
            const response = yield call(axiosCall, requestUrl);
            const sortedGroups = response.data.sort((a, b) => sortGroup(a, b));
            yield put(showAllGroups(sortedGroups));
            if (response.data.length === 0) {
                const message = i18n.t(CHOSEN_SEMESTER_HAS_NOT_GROUPS, {
                    cardType: i18n.t(FORM_CHOSEN_SEMESTER_LABEL),
                    actionType: i18n.t(SERVICE_MESSAGE_GROUP_LABEL),
                });
                const isOpen = true;
                const type = snackbarTypes.INFO;
                yield put(setOpenSnackbar({ isOpen, type, message }));
            }
        }
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}
