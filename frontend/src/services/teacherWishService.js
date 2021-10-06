import { store } from '../index';

import { TEACHER_WISH_FORM } from '../constants/reduxForms';

import { MY_TEACHER_WISHES_URL, TEACHER_WISHES } from '../constants/axios';
import axios from '../helper/axios';
import i18n from '../helper/i18n';

import { selectWishCard, setMyTeacherWishes, showAllWishes } from '../redux/actions';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';

let teacherWithWish = {};

export const showTeacherWish = (wishId) => {
    axios
        .get(TEACHER_WISHES)
        .then((response) => {
            const teacherWish = response.data;
            const teacherWishOne = teacherWish.find((teacherWish) => {
                return wishId === +teacherWish.teacher.id;
            });

            teacherWithWish = teacherWishOne;
            store.dispatch(showAllWishes(teacherWishOne.teacherWishesList));
        })
        .catch((error) => errorHandler(error));
};

export const updateTeacherWishService = (data, teacherWishList) => {
    const updatedWish = [];

    teacherWishList[0].forEach((wish) => {
        if (wish.day_of_week === data.day_of_week) {
            wish = { ...wish, ...data };
        }
        updatedWish.push(wish);
    });

    const updatatTeacherWishes = {
        id: teacherWithWish.id,
        teacherWishesList: updatedWish,
    };

    return axios
        .put(TEACHER_WISHES, updatatTeacherWishes)
        .then((response) => {
            store.dispatch(showAllWishes(response.data.teacherWishesList));
            resetFormHandler(TEACHER_WISH_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:wish_label'),
                    actionType: i18n.t('serviceMessages:updated_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const selectTeacherWishService = (wishDay) => {
    store.dispatch(selectWishCard(wishDay));
};

export const getMyTeacherWishesService = () => {
    axios
        .get(MY_TEACHER_WISHES_URL)
        .then((response) => {
            store.dispatch(setMyTeacherWishes(response.data));
            store.dispatch(showAllWishes(response.data[0].teacherWishesList));
            teacherWithWish = { id: response.data[0].teacher.id };
        })
        .catch((error) => errorHandler(error));
};
