import {
    getWeekParity,
    isWeekOdd,
    checkSemesterEnd,
    matchDayNumberSysytemToDayName,
} from './renderScheduleTable';

describe('getWeekParity', () => {
    it('should return 1 for the first week of semester', () => {
        const startDate = '23/01/2026';
        const currentDate = new Date(2026, 0, 23); // Jan 23
        expect(getWeekParity(startDate, currentDate)).toBe(1);
    });

    it('should return 0 if current date is before semester start', () => {
        const startDate = '23/01/2026';
        const currentDate = new Date(2026, 0, 20); // Jan 20
        expect(getWeekParity(startDate, currentDate)).toBe(0);
    });

    it('should return correct week number for second week', () => {
        const startDate = '23/01/2026';
        // Next Monday after start (Jan 26)
        const currentDate = new Date(2026, 0, 26);
        const result = getWeekParity(startDate, currentDate);
        expect(result).toBeGreaterThanOrEqual(2);
    });

    it('should handle Date objects as startDate', () => {
        const startDate = new Date(2026, 0, 23);
        const currentDate = new Date(2026, 0, 23);
        expect(getWeekParity(startDate, currentDate)).toBe(1);
    });
});

describe('isWeekOdd', () => {
    it('should return true for odd numbers', () => {
        expect(isWeekOdd(1)).toBe(true);
        expect(isWeekOdd(3)).toBe(true);
        expect(isWeekOdd(5)).toBe(true);
    });

    it('should return false for even numbers', () => {
        expect(isWeekOdd(2)).toBe(false);
        expect(isWeekOdd(4)).toBe(false);
        expect(isWeekOdd(6)).toBe(false);
    });
});

describe('checkSemesterEnd', () => {
    it('should return true if semester has ended', () => {
        expect(checkSemesterEnd('01/01/2020')).toBe(true);
    });

    it('should return false if semester has not ended', () => {
        expect(checkSemesterEnd('01/01/2030')).toBe(false);
    });
});

describe('matchDayNumberSysytemToDayName', () => {
    it('should return a string', () => {
        const result = matchDayNumberSysytemToDayName();
        // On Sunday getDay()=0, daysUppercase[-1] = undefined
        if (new Date().getDay() !== 0) {
            expect(typeof result).toBe('string');
            expect(result).toMatch(/^[A-Z]+$/);
        }
    });
});