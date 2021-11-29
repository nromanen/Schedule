import i18n from '../i18n';
import { createMessage, createErrorMessage } from './sagaUtils';
import { FORM_SEMESTER_LABEL } from '../constants/translationLabels/formElements';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
} from '../constants/translationLabels/serviceMessages';

describe('createErrorMessage function', () => {
    it('should return data.massage', () => {
        const response = { data: { message: 'Unable to delete group' } };
        expect(createErrorMessage({ response })).toEqual('Unable to delete group');
    });
    it('should return message Error', () => {
        const response = undefined;
        expect(createErrorMessage({ response })).toEqual('Error');
    });
});

describe('createMessage function', () => {
    it('should return correct message', () => {
        expect(
            createMessage(BACK_END_SUCCESS_OPERATION, FORM_SEMESTER_LABEL, UPDATED_LABEL),
        ).toEqual(
            i18n.t(BACK_END_SUCCESS_OPERATION, {
                cardType: i18n.t(FORM_SEMESTER_LABEL),
                actionType: i18n.t(UPDATED_LABEL),
            }),
        );
    });
});
