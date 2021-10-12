import axios from '../helper/axios';
import { store } from '../index';
import { LESSON_TYPES_URL, LESSON_URL, COPY_LESSON_URL } from '../constants/axios';
import { LESSON_FORM } from '../constants/reduxForms';
import { handleSnackbarOpenService } from './snackbarService';
import { setLoadingService } from './loadingService';
import {
    deleteLessonCard,
    selectGroupId,
    selectLessonCard,
    setLessonsCards,
    setLessonTypes,
    setUniqueError,
    storeLessonCard,
    updateLessonCard,
} from '../redux/actions/index';
import { snackbarTypes } from '../constants/snackbarTypes';
import { checkUniqLesson } from '../validation/storeValidation';
import i18n from '../helper/i18n';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
    COPIED_LABEL,
} from '../constants/translationLabels';
import { FORM_LESSON_LABEL } from '../constants/translationLabels/formElements';
import { COMMON_LESSON_SERVICE_IS_NOT_UNIQUE } from '../constants/translationLabels/common';

export const getLessonsByGroupService = (groupId) => {
    axios
        .get(`${LESSON_URL}?groupId=${Number(groupId)}`)
        .then((response) => {
            store.dispatch(setLessonsCards(response.data));
            setLoadingService(false);
        })
        .catch((err) => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const getLessonTypesService = () => {
    axios
        .get(LESSON_TYPES_URL)
        .then((response) => {
            store.dispatch(setLessonTypes(response.data));
        })
        .catch((err) => {
            errorHandler(err);
        });
};

const cardObjectHandler = (card, groupId, semester) => {
    const groupData =
        card.groups.map((group) => group.id).includes(groupId) && card.groups.length !== 1
            ? { groups: card.groups }
            : { groups: [{ id: groupId }] };
    return {
        ...groupData,
        id: Number(card.lessonCardId),
        hours: Number(card.hours),
        subject: {
            id: Number(card.subject),
        },
        lessonType: card.type,
        subjectForSite: card.subjectForSite,
        teacher: { id: Number(card.teacher) },
        linkToMeeting: card.linkToMeeting,
        grouped: card.grouped,
        semester,
    };
};

export const selectLessonCardService = (lessonCardId) => {
    store.dispatch(selectLessonCard(lessonCardId));
};

const updateLessonHandler = (data, groupId) => {
    let res = { ...data };
    const { groups, ...result } = res;
    res = { ...result };
    res.group = { id: groupId };
    return axios
        .put(LESSON_URL, res)
        .then((response) => {
            store.dispatch(updateLessonCard(response.data));
            selectLessonCardService(null);
            resetFormHandler(LESSON_FORM);

            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_LESSON_LABEL),
                    actionType: i18n.t(UPDATED_LABEL),
                }),
            );
        })
        .catch((err) => {
            errorHandler(err);
        });
};

const createLessonHandler = (data, isCopy) => {
    return axios
        .post(LESSON_URL, data)
        .then((response) => {
            if (!isCopy) {
                store.dispatch(storeLessonCard(response.data));
            }
            resetFormHandler(LESSON_FORM);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_LESSON_LABEL),
                    actionType: i18n.t(CREATED_LABEL),
                }),
            );
        })
        .catch((err) => {
            errorHandler(err);
        });
};

export const setUniqueErrorService = (isUniqueError) => {
    store.dispatch(setUniqueError(isUniqueError));
};

export const handleLessonCardService = (card, groupId, semester) => {
    let cardObj = cardObjectHandler(card, groupId, semester);
    if (!checkUniqLesson(cardObj)) {
        handleSnackbarOpenService(
            true,
            snackbarTypes.ERROR,
            i18n.t(COMMON_LESSON_SERVICE_IS_NOT_UNIQUE),
        );
        setUniqueErrorService(true);
        return;
    }

    axios
        .get(`teachers/${cardObj.teacher.id}`)
        .then((res) => {
            cardObj = { ...cardObj, teacher: res.data };
            if (cardObj.id) updateLessonHandler(cardObj, groupId);
            else createLessonHandler(cardObj, false);
        })
        .catch((error) => errorHandler(error));
};
export const removeLessonCardService = (lessonCardId) => {
    axios
        .delete(`${LESSON_URL}/${lessonCardId}`)
        .then(() => {
            store.dispatch(deleteLessonCard(lessonCardId));
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_LESSON_LABEL),
                    actionType: i18n.t(DELETED_LABEL),
                }),
            );
        })
        .catch((err) => {
            errorHandler(err);
        });
};

export const copyLessonCardService = (lessonGroupObj) => {
    const groupList = [];
    lessonGroupObj.group.map((groupItem) => groupList.push(groupItem.id));
    axios
        .post(`${COPY_LESSON_URL}?lessonId=${lessonGroupObj.lesson.id}`, groupList)
        .then(() => {
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_LESSON_LABEL),
                    actionType: i18n.t(COPIED_LABEL),
                }),
            );
        })
        .catch((err) => {
            errorHandler(err);
        });
};

export const selectGroupIdService = (groupId) => {
    store.dispatch(selectGroupId(groupId));
};
