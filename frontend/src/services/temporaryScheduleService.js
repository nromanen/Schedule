import axios from '../helper/axios';
import { errorHandler, successHandler } from '../helper/handlerAxios';

import { store } from '../index';

import {
    TEACHER_TEMPORARY_SCHEDULE,
    TEMPORARY_SCHEDULE_URL
} from '../constants/axios';

import { setLoadingService } from './loadingService';

import {
    deleteTemporarySchedule,
    selectTemporarySchedule,
    setSchedulesAndTemporarySchedules,
    setTemporarySchedules
} from '../redux/actions/index';
import { selectTeacherId } from '../redux/actions/temporarySchedule';

import i18n from '../helper/i18n';

export const getTemporarySchedulesService = (from, to) => {
    axios
        .get(TEMPORARY_SCHEDULE_URL, { params: { from, to } })
        .then(response => {
            store.dispatch(setSchedulesAndTemporarySchedules([]));
            store.dispatch(setTemporarySchedules(response.data));
            setLoadingService(false);
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const getTeacherTemporarySchedulesService = (teacherId, from, to) => {
    axios
        .get(TEACHER_TEMPORARY_SCHEDULE, { params: { teacherId, from, to } })
        .then(response => {
            store.dispatch(setTemporarySchedules([]));
            store.dispatch(setSchedulesAndTemporarySchedules(response.data));
            setLoadingService(false);
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const deleteTemporaryScheduleService = temporaryScheduleId => {
    axios
        .delete(TEMPORARY_SCHEDULE_URL + `/${temporaryScheduleId}`)
        .then(() => {
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:temporary_schedule_label'),
                    actionType: i18n.t('serviceMessages:deleted_label')
                })
            );
        })
        .catch(err => {
            errorHandler(err);
        });
};

export const addTemporaryScheduleService = (teacherId, formValues) => {
    formValues.date = formValues.date.replace(/\//g, '-');
    let obj = {};
    if (teacherId) obj = { teacher: { id: teacherId } };
    if (formValues.scheduleId)
        obj = {
            ...obj,
            class: { id: formValues.period },
            date: formValues.date,
            group: { id: formValues.group },
            id: formValues.id ? formValues.id : null,
            lessonType: formValues.lessonType,
            room: { id: formValues.room },
            schedule: { id: formValues.scheduleId },
            semester: { id: 14 },
            subject: { id: formValues.subject },
            subjectForSite: formValues.subjectForSite,
            teacherForSite: formValues.teacherForSite
        };
    axios
        .post(TEMPORARY_SCHEDULE_URL, {
            ...formValues,
            ...obj
        })
        .then(() => {
            getTeacherTemporarySchedulesService(
                teacherId,
                formValues.date,
                formValues.date
            );
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:temporary_schedule_label'),
                    actionType: i18n.t('serviceMessages:created_label')
                })
            );
        })
        .catch(err => {
            errorHandler(err);
        });
};

export const selectTemporaryScheduleService = temporarySchedule => {
    store.dispatch(selectTemporarySchedule(temporarySchedule));
};

export const selectTeacherIdService = teacherId => {
    store.dispatch(selectTeacherId(teacherId));
};
