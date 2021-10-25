import { store } from '../store';

import axios from '../helper/axios';
import i18n from '../i18n';
import { errorHandler, infoHandler, successHandler } from '../helper/handlerAxios';
import {
    checkAvailabilitySchedule,
    deleteItemFromSchedule,
    setCurrentSemester,
    setDefaultSemester,
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
    setTeacherViewType,
} from '../actions/index';

import {
    setLoadingService,
    setScheduleLoadingService,
    setSemesterLoadingService,
} from './loadingService';
import { handleSnackbarOpenService } from './snackbarService';
import {
    CURRENT_SEMESTER_URL,
    DEFAULT_SEMESTER_URL,
    FULL_SCHEDULE_URL,
    GROUP_SCHEDULE_URL,
    SCHEDULE_CHECK_AVAILABILITY_URL,
    SCHEDULE_ITEMS_URL,
    SCHEDULE_SEMESTER_ITEMS_URL,
    PUBLIC_SEMESTERS_URL,
    TEACHER_SCHEDULE_URL,
    PUBLIC_TEACHER_URL,
    FOR_TEACHER_SCHEDULE_URL,
    CLEAR_SCHEDULE_URL,
    ROOMS_AVAILABILITY,
    SCHEDULE_ITEM_ROOM_CHANGE,
    TEACHER_URL,
    SEMESTERS_URL,
    GROUPS_URL,
    SEND_PDF_TO_EMAIL,
    DEPARTMENT_URL,
} from '../constants/axios';
import { snackbarTypes } from '../constants/snackbarTypes';
import { showBusyRooms } from './busyRooms';
import { TEACHER_SCHEDULE_FORM } from '../constants/reduxForms';
import { resetFormHandler } from '../helper/formHelper';
import { getAllTeachersByDepartmentId } from '../actions/teachers';
import { sortGroup } from './groupService';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CLEARED_LABEL,
    SERVICE_MESSAGE_GROUP_LABEL,
    CHOSEN_SEMESTER_HAS_NOT_GROUPS,
    SERVICE_MESSAGE_SENT_LABEL,
} from '../constants/translationLabels/serviceMessages';
import {
    FORM_SCHEDULE_LABEL,
    FORM_CHOSEN_SEMESTER_LABEL,
} from '../constants/translationLabels/formElements';
import {
    NO_CURRENT_SEMESTER_ERROR,
    COMMON_SCHEDULE_TITLE,
} from '../constants/translationLabels/common';

export const disableDefaultSemesterService = () => {
    store.dispatch(setDefaultSemester({}));
};

const getScheduleItemsServiceBySemester = (semesterId) => {
    axios
        .get(`${SCHEDULE_SEMESTER_ITEMS_URL}?semesterId=${semesterId}`)
        .then((response) => {
            store.dispatch(setScheduleItems(response.data));
            setScheduleLoadingService(false);
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const getScheduleItemsService = () => {
    axios
        .get(CURRENT_SEMESTER_URL)
        .then((response) => {
            store.dispatch(setCurrentSemester(response.data));
            getScheduleItemsServiceBySemester(response.data.id);
            showBusyRooms(response.data.id);
        })
        .catch(() => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, i18n.t(NO_CURRENT_SEMESTER_ERROR));
            setLoadingService(false);
        });
};

export const checkAvailabilityScheduleService = (item) => {
    axios
        .get(
            `${SCHEDULE_CHECK_AVAILABILITY_URL}?classId=${item.periodId}&dayOfWeek=${item.dayOfWeek}&evenOdd=${item.evenOdd}&lessonId=${item.lessonId}&semesterId=${item.semesterId}`,
        )
        .then((response) => {
            setLoadingService(false);
            store.dispatch(checkAvailabilitySchedule(response.data));
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const checkAvailabilityChangeRoomScheduleService = (item) => {
    axios
        .get(
            `${ROOMS_AVAILABILITY}?classId=${item.periodId}&dayOfWeek=${item.dayOfWeek}&evenOdd=${item.evenOdd}&semesterId=${item.semesterId}`,
        )
        .then((response) => {
            setLoadingService(false);
            store.dispatch(
                checkAvailabilitySchedule({
                    classSuitsToTeacher: true,
                    teacherAvailable: true,
                    rooms: response.data,
                }),
            );
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const addItemToScheduleService = (item) => {
    axios
        .post(SCHEDULE_ITEMS_URL, item)
        .then(() => {
            getScheduleItemsService();
        })
        .catch((err) => errorHandler(err));
};

export const editRoomItemToScheduleService = (item) => {
    axios
        .put(`${SCHEDULE_ITEM_ROOM_CHANGE}?roomId=${item.roomId}&scheduleId=${item.itemId}`)
        .then(() => {
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(COMMON_SCHEDULE_TITLE),
                    actionType: i18n.t(UPDATED_LABEL),
                }),
            );
            getScheduleItemsService();
        })
        .catch((err) => errorHandler(err));
};

export const deleteItemFromScheduleService = (itemId) => {
    axios
        .delete(`${SCHEDULE_ITEMS_URL}/${itemId}`)
        .then(() => {
            store.dispatch(deleteItemFromSchedule(itemId));
            getScheduleItemsService();
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const getGroupSchedule = (groupId, semesterId) => {
    if (groupId > 0) {
        axios
            .get(`${GROUP_SCHEDULE_URL + semesterId}&groupId=${groupId}`)
            .then((response) => {
                store.dispatch(setGroupSchedule(response.data));
                setLoadingService(false);
            })
            .catch((err) => errorHandler(err));
    }
};

export const setScheduleSemesterIdService = (semesterId) => {
    store.dispatch(setScheduleSemesterId(semesterId));
};

export const setScheduleTypeService = (item) => {
    store.dispatch(setScheduleType(item));
};

export const setScheduleGroupIdService = (groupId) => {
    store.dispatch(setScheduleGroupId(groupId));
};

export const setScheduleTeacherIdService = (teacherId) => {
    store.dispatch(setScheduleTeacherId(teacherId));
};

export const getTeacherSchedule = (teacherId, semesterId) => {
    if (teacherId > 0) {
        axios
            .get(`${TEACHER_SCHEDULE_URL + semesterId}&teacherId=${teacherId}`)
            .then((response) => {
                store.dispatch(setTeacherSchedule(response.data));
                setLoadingService(false);
            })
            .catch((err) => errorHandler(err));
    }
};

export const getFullSchedule = (semesterId) => {
    if (semesterId !== undefined)
        axios
            .get(FULL_SCHEDULE_URL + semesterId)
            .then((response) => {
                store.dispatch(setFullSchedule(response.data));
                setLoadingService(false);
            })
            .catch((err) => errorHandler(err));
};

export const sendTeachersScheduleService = (data) => {
    const teachersId = data.teachersId.map((teacherId) => `teachersId=${teacherId}`).join('&');
    const { semesterId, language } = data;
    axios
        .get(`${SEND_PDF_TO_EMAIL}/semester/${semesterId}?language=${language}&${teachersId}`)
        .then(() => {
            setLoadingService(false);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SCHEDULE_LABEL),
                    actionType: i18n.t(SERVICE_MESSAGE_SENT_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const setItemGroupIdService = (groupId) => {
    store.dispatch(setItemGroupId(groupId));
};

export const showAllPublicSemestersService = () => {
    axios
        .get(PUBLIC_SEMESTERS_URL)
        .then((response) => {
            store.dispatch(setSemesterList(response.data));
        })
        .catch((err) => errorHandler(err));
};

export const showAllPublicGroupsService = (id) => {
    if (id !== null && id !== undefined)
        axios
            .get(`/${SEMESTERS_URL}/${id}/${GROUPS_URL}`)
            .then((response) => {
                store.dispatch(showAllGroups(response.data.sort((a, b) => sortGroup(a, b))));
                if (response.data.length === 0) {
                    infoHandler(
                        i18n.t(CHOSEN_SEMESTER_HAS_NOT_GROUPS, {
                            cardType: i18n.t(FORM_CHOSEN_SEMESTER_LABEL),
                            actionType: i18n.t(SERVICE_MESSAGE_GROUP_LABEL),
                        }),
                    );
                }
            })
            .catch((err) => errorHandler(err));
};

export const showAllPublicTeachersService = () => {
    axios
        .get(PUBLIC_TEACHER_URL)
        .then((response) => {
            store.dispatch(showAllTeachers(response.data));
        })
        .catch((err) => errorHandler(err));
};

export const showAllPublicTeachersByDepartmentService = (departmentId) => {
    axios
        .get(`${DEPARTMENT_URL}/${departmentId}/${TEACHER_URL}`)
        .then((response) => {
            store.dispatch(getAllTeachersByDepartmentId(response.data));
        })
        .catch((err) => errorHandler(err));
};

export const clearTeacherScheduleFormService = () => {
    resetFormHandler(TEACHER_SCHEDULE_FORM);
};

export const getTeacherScheduleService = (values) => {
    axios
        .get(
            `${FOR_TEACHER_SCHEDULE_URL}?from=${values.startDay.replace(
                /\//g,
                '-',
            )}&to=${values.endDay.replace(/\//g, '-')}`,
        )
        .then((response) => {
            setLoadingService(false);
            store.dispatch(setTeacherRangeSchedule(response.data));
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const getTeacherScheduleByDateRangeService = (teacherId, to, from) => {
    axios
        .get(
            `${FOR_TEACHER_SCHEDULE_URL}?teacherId${teacherId}&from=${from.replace(
                /\//g,
                '-',
            )}&to=${to.replace(/\//g, '-')}`,
        )
        .then(() => {})
        .catch((err) => {
            errorHandler(err);
        });
};

export const setTeacherServiceViewType = (type) => {
    store.dispatch(setTeacherViewType(type));
};

export const clearSchedule = (semesterId) => {
    axios
        .delete(`${CLEAR_SCHEDULE_URL}?semesterId=${semesterId}`)
        .then(() => {
            getScheduleItemsService();
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(COMMON_SCHEDULE_TITLE),
                    actionType: i18n.t(CLEARED_LABEL),
                }),
            );
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};
