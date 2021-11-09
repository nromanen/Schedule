import { call, put, takeLatest } from 'redux-saga/effects';
import { TEACHER_URL } from '../constants/axios';
import { DELETE } from '../constants/methods';
import { axiosCall } from '../services/axios';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';
import {
    BACK_END_SUCCESS_OPERATION,
    DELETED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_TEACHER_A_LABEL } from '../constants/translationLabels/formElements';
import { deleteTeacher } from '../actions';
import { setOpenSuccessSnackbar } from '../actions/snackbar';
import { getDisabledTeachersService } from '../services/teacherService';
import * as actionTypes from '../actions/actionsType';

export function* removeTeacher({ result }) {
    try {
        const requestUrl = `${TEACHER_URL}/${result}`;
        yield call(axiosCall, requestUrl, DELETE);

        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_TEACHER_A_LABEL,
            DELETED_LABEL,
        );

        yield put(deleteTeacher(result));
        getDisabledTeachersService();
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(createErrorMessage(error));
    }
}

export default function* watchTeachers() {
    yield takeLatest(actionTypes.DELETE_TEACHER_START, removeTeacher);
}
