import { store } from '../index';
import {
    DISABLED_TEACHERS_URL,
    TEACHER_URL,
    TEACHERS_WITHOUT_ACCOUNT_URL,
} from '../constants/axios';
import { TEACHER_FORM } from '../constants/reduxForms';

import axios from '../helper/axios';

import i18n from '../helper/i18n';

import {
    addTeacher,
    deleteTeacher,
    selectTeacherCard,
    setDisabledTeachers,
    showAllTeachers,
    updateTeacherCard,
} from '../redux/actions';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';
import { setLoadingService } from './loadingService';

export const showAllTeachersService = () => {
    const data = [
        {
            department: {
                id: 41,
                name: 'mat analysi',
                disable: false,
            },
            id: 49,
            name: 'Світлана',
            surname: 'Боднарук',
            patronymic: 'Богданівна',
            position: 'доцент',
            disable: false,
            email: 'nasta_2000@i.ua',
        },

        {
            department: {
                id: 41,
                name: 'mat analysi',
                disable: false,
            },
            id: 78,
            name: 'Наталія',
            surname: 'Романенко',
            patronymic: 'Богданівна',
            position: 'доцент',
            disable: false,
            email: 'nasta_2000@i.ua',
        },
        {
            department: {
                id: 41,
                name: 'mat analysi',
                disable: false,
            },
            id: 79,
            name: 'Анна',
            surname: 'Івах',
            patronymic: 'Іванівна',
            position: 'доцент',
            disable: false,
            email: 'nasta_2000@i.ua',
        },
        {
            department: {
                id: 44,
                name: 'Computer Science1',
                disable: false,
            },
            id: 39,
            name: 'Ірина',
            surname: 'Вернигора',
            patronymic: 'Володимирівна',
            position: 'доцент',
            disable: false,
            email: 'nasta_2000@i.ua',
        },
    ];
    store.dispatch(showAllTeachers(data));
    setLoadingService(false);
    // axios
    //     .get(TEACHER_URL)
    //     .then(response => {
    //         store.dispatch(showAllTeachers(response.data));
    //         setLoadingService(false);
    //     })
    //     .catch(error => errorHandler(error));
};

export const getTeachersWithoutAccount = () => {
    axios
        .get(TEACHERS_WITHOUT_ACCOUNT_URL)
        .then((response) => {
            store.dispatch(showAllTeachers(response.data));
        })
        .catch((error) => errorHandler(error));
};

export const createTeacherService = (values) => {
    values.wish = [];
    axios
        .post(TEACHER_URL, values)
        .then((response) => {
            store.dispatch(addTeacher(response.data));
            resetFormHandler(TEACHER_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:teacher_a_label'),
                    actionType: i18n.t('serviceMessages:created_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

const cardTeacher = (teacher) => {
    return {
        teacher: {
            id: teacher.id,
            name: teacher.name,
            surname: teacher.surname,
            patronymic: teacher.patronymic,
            position: teacher.position,
            email: teacher.email,
            department: teacher.department,
        },
    };
};

export const updateTeacherService = (data) => {
    return axios
        .put(TEACHER_URL, data.teacher)
        .then((response) => {
            store.dispatch(updateTeacherCard(response.data));
            if (response.data.disable) {
                store.dispatch(deleteTeacher(response.data.id));
            }
            showAllTeachersService();
            getDisabledTeachersService();

            selectTeacherCardService(null);
            resetFormHandler(TEACHER_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:teacher_a_label'),
                    actionType: i18n.t('serviceMessages:updated_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const handleTeacherService = (values) => {
    const teacher = cardTeacher(values);

    if (values.id) {
        updateTeacherService(teacher);
    } else {
        createTeacherService(values);
    }
};

export const removeTeacherCardService = (id) => {
    axios
        .delete(`${TEACHER_URL}/${id}`)
        .then((response) => {
            store.dispatch(deleteTeacher(id));
            getDisabledTeachersService();
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:teacher_a_label'),
                    actionType: i18n.t('serviceMessages:deleted_label'),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const selectTeacherCardService = (teacherCardId) => {
    store.dispatch(selectTeacherCard(teacherCardId));
};

export const getDisabledTeachersService = () => {
    axios
        .get(DISABLED_TEACHERS_URL)
        .then((res) => {
            store.dispatch(setDisabledTeachers(res.data));
        })
        .catch((error) => errorHandler(error));
};

export const setDisabledTeachersService = (teacher) => {
    teacher.disable = true;
    updateTeacherService({ teacher });
};

export const setEnabledTeachersService = (teacher) => {
    teacher.disable = false;
    updateTeacherService({ teacher });
};
