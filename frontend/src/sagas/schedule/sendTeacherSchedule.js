import { call, put } from 'redux-saga/effects';
import { setLoading, setOpenSnackbar } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { SEND_PDF_TO_EMAIL } from '../../constants/axios';
import {
    BACK_END_SUCCESS_OPERATION,
    SERVICE_MESSAGE_SENT_LABEL,
} from '../../constants/translationLabels/serviceMessages';
import { FORM_SCHEDULE_LABEL } from '../../constants/translationLabels/formElements';

export function* sendTeacherSchedule({ data }) {
    try {
        const teachersId = data.teachersId.map((teacherId) => `teachersId=${teacherId}`).join('&');
        const { semesterId, language } = data;
        const responseUrl = `${SEND_PDF_TO_EMAIL}/semester/${semesterId}?language=${language}&${teachersId}`;
        const response = yield call(axiosCall, responseUrl);
        console.log(response);
        const message = i18n.t(BACK_END_SUCCESS_OPERATION, {
            cardType: i18n.t(FORM_SCHEDULE_LABEL),
            actionType: i18n.t(SERVICE_MESSAGE_SENT_LABEL),
        });
        const isOpen = true;
        const type = snackbarTypes.SUCCESS;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setLoading(false));
    } catch (error) {
        yield put(setLoading(false));
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}
