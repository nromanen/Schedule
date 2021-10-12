import axios from '../helper/axios';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import { BACK_END_SUCCESS_OPERATION } from '../constants/services';
import i18n from '../i18n';

import { store } from '../store';

import {
    TEACHER_TEMPORARY_SCHEDULE,
    TEMPORARY_SCHEDULE_RANGE_URL,
    TEMPORARY_SCHEDULE_URL,
} from '../constants/axios';
import { actionType } from '../constants/actionTypes';

import { setLoadingService } from './loadingService';
import {
    selectTeacherId,
    selectTemporarySchedule,
    selectVacation,
    setSchedulesAndTemporarySchedules,
    setTemporarySchedules,
} from '../actions/index';
import { resetFormHandler } from '../helper/formHelper';
import { TEMPORARY_SCHEDULE_FORM, TEMPORARY_SCHEDULE_VACATION_FORM } from '../constants/reduxForms';

const handleSuccessMessage = (action) => {
    return i18n.t(BACK_END_SUCCESS_OPERATION, {
        cardType: i18n.t('formElements:temporary_schedule_label'),
        actionType: i18n.t(`serviceMessages:${action}_label`),
    });
};

export const getTemporarySchedulesService = (from, to) => {
    axios
        .get(TEMPORARY_SCHEDULE_URL, { params: { from, to } })
        .then((response) => {
            store.dispatch(setSchedulesAndTemporarySchedules([]));
            store.dispatch(setTemporarySchedules(response.data));
            setLoadingService(false);
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const getTeacherTemporarySchedulesService = (teacherId, from, to) => {
    axios
        .get(TEACHER_TEMPORARY_SCHEDULE, { params: { teacherId, from, to } })
        .then((response) => {
            store.dispatch(setTemporarySchedules([]));
            store.dispatch(setSchedulesAndTemporarySchedules(response.data));
            setLoadingService(false);
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const deleteTemporaryScheduleService = (temporaryScheduleId, date, teacherId) => {
    axios
        .delete(`${TEMPORARY_SCHEDULE_URL}/${temporaryScheduleId}`)
        .then(() => {
            if (teacherId) getTeacherTemporarySchedulesService(teacherId, date, date);
            else getTemporarySchedulesService(null, null);
            successHandler(handleSuccessMessage(actionType.DELETED));
        })
        .catch((err) => {
            errorHandler(err);
        });
};

const formatObj = (formValues, teacherId) => {
    let obj = {};
    if (teacherId) obj = { teacher: { id: teacherId } };
    else if (formValues.teacher) obj = { teacher: { id: formValues.teacher } };
    if (!formValues.vacation || (formValues.vacation && formValues.scheduleId))
        obj = {
            ...obj,
            id: formValues.id ? formValues.id : null,
            class: { id: formValues.period },
            date: formValues.date,
            group: { id: formValues.group },
            lessonType: formValues.lessonType,
            room: { id: formValues.room },
            schedule: { id: formValues.scheduleId },
            semester: { id: formValues.semester },
            subject: { id: formValues.subject },
            subjectForSite: formValues.subjectForSite,
            linkToMeeting: formValues.linkToMeeting,
        };
    return obj;
};

const handleSuccess = (isVacation, teacherId, formValues) => {
    store.dispatch(selectTemporarySchedule({}));
    store.dispatch(selectVacation({}));
    if (!isVacation || (isVacation && formValues.scheduleId)) {
        resetFormHandler(TEMPORARY_SCHEDULE_FORM);
        getTeacherTemporarySchedulesService(teacherId, formValues.date, formValues.date);
    } else {
        resetFormHandler(TEMPORARY_SCHEDULE_VACATION_FORM);
        store.dispatch(selectTeacherId(null));
        getTemporarySchedulesService(null, null);
    }
};

export const addTemporaryScheduleService = (teacherId, formValues, isVacation) => {
    formValues.date = formValues.date.replace(/\//g, '-');
    const obj = formatObj(formValues, teacherId);
    axios
        .post(TEMPORARY_SCHEDULE_URL, {
            ...formValues,
            ...obj,
        })
        .then(() => {
            handleSuccess(isVacation, teacherId, formValues);
            successHandler(handleSuccessMessage(actionType.CREATED));
        })
        .catch((err) => {
            errorHandler(err);
        });
};

export const addTemporaryScheduleForRangeService = (teacherId, formValues, isVacation) => {
    formValues.from = formValues.from.replace(/\//g, '-');
    formValues.to = formValues.to.replace(/\//g, '-');
    const obj = formatObj(formValues, teacherId);
    axios
        .post(TEMPORARY_SCHEDULE_RANGE_URL, {
            from: formValues.from,
            to: formValues.to,
            temporary_schedule: {
                ...formValues,
                ...obj,
            },
        })
        .then(() => {
            handleSuccess(isVacation, teacherId, formValues);
            successHandler(handleSuccessMessage(actionType.CREATED));
        })
        .catch((err) => {
            errorHandler(err);
        });
};

export const editTemporaryScheduleService = (teacherId, formValues, isVacation) => {
    formValues.date = formValues.date.replace(/\//g, '-');
    const obj = formatObj(formValues, teacherId);
    axios
        .put(TEMPORARY_SCHEDULE_URL, {
            ...formValues,
            ...obj,
        })
        .then(() => {
            const tId = teacherId || formValues.teacher;
            handleSuccess(isVacation, tId, formValues);
            successHandler(handleSuccessMessage(actionType.UPDATED));
        })
        .catch((err) => {
            errorHandler(err);
        });
};

export const selectTemporaryScheduleService = (temporarySchedule) => {
    store.dispatch(selectVacation({}));
    store.dispatch(selectTemporarySchedule(temporarySchedule));
};

export const selectVacationService = (vacation) => {
    store.dispatch(selectTemporarySchedule({}));
    store.dispatch(selectVacation(vacation));
};

export const selectTeacherIdService = (teacherId) => {
    store.dispatch(selectTeacherId(teacherId));
};
