import { store } from '../index';

import axios from '../helper/axios';
import i18n from '../helper/i18n';
import { errorHandler, successHandler } from '../helper/handlerAxios';

import {
    checkAvailabilitySchedule,
    deleteItemFromSchedule,
    setCurrentSemester,
    setFullSchedule,
    setGroupSchedule,
    setItemGroupId,
    setScheduleGroupId,
    setScheduleItems,
    setScheduleSemesterId,
    setScheduleTeacherId,
    setScheduleType,
    setSemesterList,
    setTeacherSchedule,
    showAllGroups,
    showAllTeachers,
    setTeacherRangeSchedule,
    setTeacherViewType
} from '../redux/actions/index';

import { setLoadingService, setScheduleLoadingService } from './loadingService';
import { handleSnackbarOpenService } from './snackbarService';

import {
    CURRENT_SEMESTER_URL,
    FULL_SCHEDULE_URL,
    GROUP_SCHEDULE_URL,
    SCHEDULE_CHECK_AVAILABILITY_URL,
    SCHEDULE_ITEMS_URL,
    SCHEDULE_SEMESTER_ITEMS_URL,
    PUBLIC_SEMESTERS_URL,
    TEACHER_SCHEDULE_URL,
    PUBLIC_GROUP_URL,
    PUBLIC_TEACHER_URL,
    FOR_TEACHER_SCHEDULE_URL,
    CLEAR_SCHEDULE_URL,
    ROOMS_AVAILABILITY,
    SCHEDULE_ITEM_ROOM_CHANGE
} from '../constants/axios';

import { snackbarTypes } from '../constants/snackbarTypes';

import { showBusyRooms } from './busyRooms';
import { TEACHER_SCHEDULE_FORM } from '../constants/reduxForms';
import { resetFormHandler } from '../helper/formHelper';

export const getCurrentSemesterService = () => {
    axios
        .get(CURRENT_SEMESTER_URL)
        .then(response => {
            setLoadingService(false);
            store.dispatch(setCurrentSemester(response.data));
        })
        .catch(err => {
            handleSnackbarOpenService(
                true,
                snackbarTypes.ERROR,
                i18n.t('common:no_current_semester_error')
            );
            setLoadingService(false);
        });
};

export const getScheduleItemsService = () => {
    axios
        .get(CURRENT_SEMESTER_URL)
        .then(response => {
            store.dispatch(setCurrentSemester(response.data));
            getScheduleItemsServiceBySemester(response.data.id);
            showBusyRooms(response.data.id);
        })
        .catch(err => {
            handleSnackbarOpenService(
                true,
                snackbarTypes.ERROR,
                i18n.t('common:no_current_semester_error')
            );
            setLoadingService(false);
        });
};

const getScheduleItemsServiceBySemester = semesterId => {
    axios
        .get(`${SCHEDULE_SEMESTER_ITEMS_URL}?semesterId=${semesterId}`)
        .then(response => {
            store.dispatch(setScheduleItems(response.data));
            setScheduleLoadingService(false);
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const checkAvailabilityScheduleService = item => {
    axios
        .get(
            SCHEDULE_CHECK_AVAILABILITY_URL +
                '?classId=' +
                item.periodId +
                '&dayOfWeek=' +
                item.dayOfWeek +
                '&evenOdd=' +
                item.evenOdd +
                '&lessonId=' +
                item.lessonId +
                '&semesterId=' +
                item.semesterId
        )
        .then(response => {
            setLoadingService(false);
            store.dispatch(checkAvailabilitySchedule(response.data));
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};
export const checkAvailabilityChangeRoomScheduleService = item => {
    axios
        .get(
            ROOMS_AVAILABILITY +
                '?classId=' +
                item.periodId +
                '&dayOfWeek=' +
                item.dayOfWeek +
                '&evenOdd=' +
                item.evenOdd +
                '&semesterId=' +
                item.semesterId
        )
        .then(response => {
            setLoadingService(false);
            store.dispatch(
                checkAvailabilitySchedule({
                    classSuitsToTeacher: true,
                    teacherAvailable: true,
                    rooms: response.data
                })
            );
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};
export const addItemToScheduleService = item => {
    axios
        .post(SCHEDULE_ITEMS_URL, item)
        .then(response => {
            getScheduleItemsService();
        })
        .catch(err => errorHandler(err));
};
export const editRoomItemToScheduleService = item => {
    axios
        .put(
            SCHEDULE_ITEM_ROOM_CHANGE +
                '?roomId=' +
                item.roomId +
                '&scheduleId=' +
                item.itemId
        )
        .then(response => {
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('common:schedule_title'),
                    actionType: i18n.t('serviceMessages:updated_label')
                })
            );
            getScheduleItemsService();
        })
        .catch(err => errorHandler(err));
};
export const deleteItemFromScheduleService = itemId => {
    axios
        .delete(`${SCHEDULE_ITEMS_URL}/${itemId}`)
        .then(response => {
            store.dispatch(deleteItemFromSchedule(itemId));
            getScheduleItemsService();
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const submitSearchSchedule = values => {
    setScheduleSemesterIdService(values.semester);
    if (values.hasOwnProperty('group') && +values.group > 0) {
        setScheduleTypeService('group');
        setScheduleGroupIdService(values.group);
        getGroupSchedule(values.group, values.semester);
        return;
    }
    if (values.hasOwnProperty('teacher') && +values.teacher > 0) {
        setScheduleTypeService('teacher');
        setScheduleGroupIdService(values.teacher);
        getTeacherSchedule(values.teacher, values.semester);
        return;
    }
    if (
        (!values.hasOwnProperty('group') &&
            !values.hasOwnProperty('teacher')) ||
        (values.hasOwnProperty('group') &&
            !values.hasOwnProperty('teacher') &&
            +values.group === 0) ||
        (!values.hasOwnProperty('group') &&
            values.hasOwnProperty('teacher') &&
            +values.teacher === 0) ||
        (values.hasOwnProperty('group') &&
            values.hasOwnProperty('teacher') &&
            +values.teacher === 0 &&
            +values.group === 0)
    ) {
        setScheduleTypeService('full');
        getFullSchedule(values.semester);
    }
};

export const setItemGroupIdService = groupId => {
    store.dispatch(setItemGroupId(groupId));
};

export const setScheduleGroupIdService = groupId => {
    store.dispatch(setScheduleGroupId(groupId));
};

export const setScheduleTypeService = item => {
    store.dispatch(setScheduleType(item));
};

export const getFullSchedule = semesterId => {
    axios
        .get(FULL_SCHEDULE_URL + semesterId)
        .then(response => {
            store.dispatch(setFullSchedule(response.data));
        })
        .catch(err => errorHandler(err));
};

export const getGroupSchedule = (groupId, semesterId) => {
    if (groupId > 0) {
        axios
            .get(GROUP_SCHEDULE_URL + semesterId + '&groupId=' + groupId)
            .then(response => {
                store.dispatch(setGroupSchedule(response.data));
            })
            .catch(err => errorHandler(err));
    }
};
export const getTeacherSchedule = (teacherId, semesterId) => {
    if (teacherId > 0) {
        axios
            .get(TEACHER_SCHEDULE_URL + semesterId + '&teacherId=' + teacherId)
            .then(response => {
                store.dispatch(setTeacherSchedule(response.data));
            })
            .catch(err => errorHandler(err));
    }
};
export const setScheduleTeacherIdService = teacherId => {
    store.dispatch(setScheduleTeacherId(teacherId));
};

export const showAllPublicSemestersService = () => {
    axios
        .get(PUBLIC_SEMESTERS_URL)
        .then(response => {
            store.dispatch(setSemesterList(response.data));
        })
        .catch(err => errorHandler(err));
};
export const setScheduleSemesterIdService = semesterId => {
    store.dispatch(setScheduleSemesterId(semesterId));
};

export const showAllPublicGroupsService = () => {
    axios
        .get(PUBLIC_GROUP_URL)
        .then(response => {
            store.dispatch(showAllGroups(response.data.sort((a, b) => a - b)));
        })
        .catch(err => errorHandler(err));
};

export const showAllPublicTeachersService = () => {
    axios
        .get(PUBLIC_TEACHER_URL)
        .then(response => {
            store.dispatch(showAllTeachers(response.data));
        })
        .catch(err => errorHandler(err));
};

export const clearTeacherScheduleFormService = () => {
    resetFormHandler(TEACHER_SCHEDULE_FORM);
};

export const getTeacherScheduleService = values => {
    axios
        .get(
            FOR_TEACHER_SCHEDULE_URL +
                '?from=' +
                values.startDay.replace(/\//g, '-') +
                '&to=' +
                values.endDay.replace(/\//g, '-')
        )
        .then(response => {
            setLoadingService(false);
            store.dispatch(setTeacherRangeSchedule(response.data));
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};
export const setTeacherServiceViewType = type => {
    store.dispatch(setTeacherViewType(type));
};

export const clearSchedule = semesterId => {
    axios
        .delete(CLEAR_SCHEDULE_URL + '?semesterId=' + semesterId)
        .then(response => {
            getScheduleItemsService();
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('common:schedule_title'),
                    actionType: i18n.t('serviceMessages:cleared_label')
                })
            );
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};
