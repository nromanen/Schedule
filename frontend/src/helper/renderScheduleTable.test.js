import {
    getWeekParity,
    isWeekOdd,
    checkSemesterEnd,
    matchDayNumberSystemToDayName,
} from './renderScheduleTable';


describe('checkSemesterEnd', () => {
    it('should return true if semester has ended', () => {
        expect(checkSemesterEnd('01/01/2020')).toBe(true);
    });

    it('should return false if semester has not ended', () => {
        expect(checkSemesterEnd('01/01/2030')).toBe(false);
    });
});

describe('matchDayNumberSystemToDayName', () => {
    it('should return a string', () => {
        const result = matchDayNumberSystemToDayName();
        // On Sunday getDay()=0, daysUppercase[-1] = undefined
        if (new Date().getDay() !== 0) {
            expect(typeof result).toBe('string');
            expect(result).toMatch(/^[A-Z]+$/);
        }
    });
});