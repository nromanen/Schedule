import {greaterThanDate, greaterThanTime, lessThanDate, lessThanTime} from "./validateFields";
import {checkUniqueSubject} from "./storeValidation";

jest.mock('../i18n', () => ({
    t: (key, params) => `${key}${params ? JSON.stringify(params) : ''}`,
}));

const makeValues = (startDay, endDay) => ({
    values: { startDay, endDay },
});

const subjects = [
    { id: 1, name: "Комп'ютерні науки" },
    { id: 2, name: 'Фізика' },
    { id: 3, name: "М'яке програмування" },
];

const _ = undefined;

describe('checkUniqueSubject', () => {
    it('returns true if name is unique', () => {
        const result = checkUniqueSubject('Математика', subjects, 4);
        expect(result).toBe(true);
    });

    it('returns error if name is duplicate', () => {
        const result = checkUniqueSubject("Комп'ютерні науки", subjects, 4);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
    });

    it('does not consider duplicate if same record', () => {
        const result = checkUniqueSubject("Комп'ютерні науки", subjects, 1);
        expect(result).toBe(true);
    });

    it('ignores case and whitespace', () => {
        const result = checkUniqueSubject("  комп'ютерні науки  ", subjects, 4);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
    });

    it('returns error for name with apostrophe duplicate', () => {
        const result = checkUniqueSubject("М'яке програмування", subjects, 4);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
    });

    it('returns true for name with apostrophe that is unique', () => {
        const result = checkUniqueSubject("Комп'ютерна графіка", subjects, 4);
        expect(result).toBe(true);
    });
});

describe('lessThanDate', () => {
    it('повертає undefined якщо endDay не визначений', () => {
        const result = lessThanDate('01/01/2024', undefined, { values: {} });
        expect(result).toBeUndefined();
    });

    it('повертає undefined якщо startDay <= endDay', () => {
        const result = lessThanDate('01/01/2024', undefined, makeValues('01/01/2024', '31/12/2024'));
        expect(result).toBeUndefined();
    });

    it('повертає undefined якщо startDay === endDay', () => {
        const result = lessThanDate('01/01/2024', undefined, makeValues('01/01/2024', '01/01/2024'));
        expect(result).toBeUndefined();
    });

    it('повертає помилку якщо startDay > endDay', () => {
        const result = lessThanDate('31/12/2024', undefined, makeValues('31/12/2024', '01/01/2024'));
        expect(result).toBeTruthy();
    });
});

describe('greaterThanDate', () => {
    it('повертає undefined якщо startDay не визначений', () => {
        const result = greaterThanDate('01/01/2024', undefined, { values: {} });
        expect(result).toBeUndefined();
    });

    it('повертає undefined якщо endDay >= startDay', () => {
        const result = greaterThanDate('31/12/2024', undefined, makeValues('01/01/2024', '31/12/2024'));
        expect(result).toBeUndefined();
    });

    it('повертає undefined якщо endDay === startDay', () => {
        const result = greaterThanDate('01/01/2024', undefined, makeValues('01/01/2024', '01/01/2024'));
        expect(result).toBeUndefined();
    });

    it('повертає помилку якщо endDay < startDay', () => {
        const result = greaterThanDate('01/01/2024', undefined, makeValues('31/12/2024', '01/01/2024'));
        expect(result).toBeTruthy();
    });
});

describe('lessThanTime', () => {
    it('returns undefined if endTime is not defined', () => {
        const result = lessThanTime('08:00', _, { values: {} });
        expect(result).toBeUndefined();
    });

    it('returns undefined if startTime < endTime', () => {
        const result = lessThanTime('08:00', _, { values: { endTime: '09:00' } });
        expect(result).toBeUndefined();
    });

    it('returns undefined if startTime === endTime', () => {
        const result = lessThanTime('08:00', _, { values: { endTime: '08:00' } });
        expect(result).toBeUndefined();
    });

    it('returns error if startTime > endTime', () => {
        const result = lessThanTime('10:00', _, { values: { endTime: '09:00' } });
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
    });
});

describe('greaterThanTime', () => {
    it('returns undefined if startTime is not defined', () => {
        const result = greaterThanTime('09:00', _, { values: {} });
        expect(result).toBeUndefined();
    });

    it('returns undefined if endTime > startTime', () => {
        const result = greaterThanTime('09:00', _, { values: { startTime: '08:00' } });
        expect(result).toBeUndefined();
    });

    it('returns undefined if endTime === startTime', () => {
        const result = greaterThanTime('08:00', _, { values: { startTime: '08:00' } });
        expect(result).toBeUndefined();
    });

    it('returns error if endTime < startTime', () => {
        const result = greaterThanTime('08:00', _, { values: { startTime: '09:00' } });
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
    });
});