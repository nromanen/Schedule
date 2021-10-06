import * as actionsType from './actionsType';

export const selectWishCard = (res) => {
    return {
        type: actionsType.SELECT_WISH,
        result: res,
    };
};

export const setMyTeacherWishes = (res) => {
    return {
        type: actionsType.SET_MY_TEACHER_WISHES,
        result: res,
    };
};

export const showAllWishes = (data) => {
    return {
        type: actionsType.SHOW_ALL_WISH,
        result: data,
    };
};
