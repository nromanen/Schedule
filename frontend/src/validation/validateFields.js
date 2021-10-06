import * as moment from 'moment';
import {
    checkUniqClassName,
    checkUniqueGroup,
    checkUniqueRoomName,
    checkUniqueSubject,
    timeIntersectService,
    checkUniqSemester,
    checkUniqueDepartment,
} from './storeValidation';
import i18n from '../helper/i18n';
import { validation } from '../constants/validation';

export const required = (value) =>
    value ? undefined : i18n.t('validationMessages:required_message');

export const lessThanZero = (value) =>
    value > 0 ? undefined : i18n.t('validationMessages:bigger_than_zero_message');

const minLength = (min) => (value) =>
    value && value.length < min
        ? i18n.t('validationMessages:bigger_than_char_message', { min })
        : undefined;

export const minLengthValue = minLength(3);

const maxLength = (max) => (value) =>
    value && value.length > max
        ? i18n.t('validationMessages:less_than_char_message', {
              max,
          })
        : undefined;

export const maxLengthValue = maxLength(200);

export const lessThanTime = (value, previousValue, allValues) => {
    const otherField = 'endTime';
    if (allValues.values[otherField] === undefined) return undefined;
    return moment(value, 'HH:mm').toDate() <=
        moment(allValues.values[otherField], 'HH:mm').toDate() &&
        allValues.values[otherField] !== undefined
        ? undefined
        : i18n.t('validationMessages:less_than_field_message', {
              field: i18n.t('formElements:class_to_label'),
          });
};

export const greaterThanTime = (value, previousValue, allValues) => {
    const otherField = 'startTime';
    if (allValues.values[otherField] === undefined) return undefined;
    return moment(value, 'HH:mm').toDate() >= moment(allValues.values[otherField], 'HH:mm').toDate()
        ? undefined
        : i18n.t('validationMessages:bigger_than_field_message', {
              field: i18n.t('formElements:class_from_label'),
          });
};

export const uniqueClassName = (value) => {
    return checkUniqClassName(value);
};

export const uniqueGroup = (value) => {
    return checkUniqueGroup(value);
};

export const uniqueSubject = (value) => {
    return checkUniqueSubject(value);
};
export const uniqueDepartment = (value) => {
    return checkUniqueDepartment(value);
};
export const timeIntersect = (value, previousValue, allValues) => {
    return timeIntersectService(allValues.values.startTime, allValues.values.endTime);
};

export const uniqueRoomName = (value) => {
    return checkUniqueRoomName(value);
};

export const email = (value) =>
    value && !validation.EMAIL.test(value) ? i18n.t('validationMessages:email') : undefined;

export const password = (value) =>
    value && !validation.PASSWORD.test(value) ? i18n.t('validationMessages:password') : undefined;

const minYear = (min) => (value) =>
    value < min
        ? i18n.t('validationMessages:bigger_than_this_year_message', {
              min,
          })
        : undefined;
const today = new Date();
const year = today.getFullYear();
export const minYearValue = minYear(year);

export const lessThanDate = (value, previousValue, allValues) => {
    const otherField = 'endDay';
    if (allValues.values[otherField] === undefined) return undefined;
    return moment(value, 'DD/MM/YYYY').toDate() <=
        moment(allValues.values[otherField], 'DD/MM/YYYY').toDate() &&
        allValues.values[otherField] !== undefined
        ? undefined
        : i18n.t('validationMessages:less_than_field_message', {
              field: i18n.t('formElements:class_to_label'),
          });
};

export const greaterThanDate = (value, previousValue, allValues) => {
    const otherField = 'startDay';
    if (allValues.values[otherField] === undefined) return undefined;
    return moment(value, 'DD/MM/YYYY').toDate() >=
        moment(allValues.values[otherField], 'DD/MM/YYYY').toDate()
        ? undefined
        : i18n.t('validationMessages:bigger_than_field_message', {
              field: i18n.t('formElements:class_from_label'),
          });
};

export const uniquesSemesterName = (value) => checkUniqSemester(value);
