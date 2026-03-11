import {getWeekParity, transformSemesterDate} from './weekUtils';

describe('getWeekParity function', () => {
    describe('before semester start', () => {
        it('should return 0 if current date is before semester start', () => {
            const startDate = '01/09/2024';
            const currentDate = new Date('2024-08-31');
            expect(getWeekParity(startDate, currentDate)).toBe(0);
        });
    });

    describe('first week', () => {
        it('should return 1 if current date is the same as semester start', () => {
            const startDate = '02/09/2024'; // Monday
            const currentDate = new Date('2024-09-02');
            expect(getWeekParity(startDate, currentDate)).toBe(1);
        });

        it('should return 1 if semester starts on Monday and current date is same week', () => {
            const startDate = '02/09/2024'; // Monday
            const currentDate = new Date('2024-09-06'); // Friday same week
            expect(getWeekParity(startDate, currentDate)).toBe(1);
        });

        it('should return 1 if semester starts on Saturday and current date is same Saturday', () => {
            const startDate = '07/09/2024'; // Saturday
            const currentDate = new Date('2024-09-07');
            expect(getWeekParity(startDate, currentDate)).toBe(1);
        });

        it('should return 1 if semester starts on Sunday and current date is same Sunday', () => {
            const startDate = '01/09/2024'; // Sunday
            const currentDate = new Date('2024-09-01');
            expect(getWeekParity(startDate, currentDate)).toBe(1);
        });
    });

    describe('week boundary - Saturday/Sunday edge case', () => {
        it('should return 1 for Saturday when semester starts on Saturday', () => {
            const startDate = '07/09/2024'; // Saturday
            const currentDate = new Date('2024-09-07'); // same Saturday
            expect(getWeekParity(startDate, currentDate)).toBe(1);
        });

        it('should return 2 for Monday after semester starts on Saturday', () => {
            const startDate = '07/09/2024'; // Saturday
            const currentDate = new Date('2024-09-09'); // Monday next week
            expect(getWeekParity(startDate, currentDate)).toBe(2);
        });

        it('should return 1 for Sunday when semester starts on Sunday', () => {
            const startDate = '01/09/2024'; // Sunday
            const currentDate = new Date('2024-09-01');
            expect(getWeekParity(startDate, currentDate)).toBe(1);
        });

        it('should return 2 for Monday after semester starts on Sunday', () => {
            const startDate = '01/09/2024'; // Sunday
            const currentDate = new Date('2024-09-02'); // Monday
            expect(getWeekParity(startDate, currentDate)).toBe(2);
        });
    });

    describe('subsequent weeks', () => {
        it('should return 2 for second week', () => {
            const startDate = '02/09/2024'; // Monday
            const currentDate = new Date('2024-09-09'); // Monday next week
            expect(getWeekParity(startDate, currentDate)).toBe(2);
        });

        it('should return 3 for third week', () => {
            const startDate = '02/09/2024'; // Monday
            const currentDate = new Date('2024-09-16');
            expect(getWeekParity(startDate, currentDate)).toBe(3);
        });

        it('should return 8 for eighth week', () => {
            const startDate = '02/09/2024'; // Monday
            const currentDate = new Date('2024-10-21');
            expect(getWeekParity(startDate, currentDate)).toBe(8);
        });
    });

    describe('accepts Date object as startDate', () => {
        it('should work with Date object instead of string', () => {
            const startDate = new Date('2024-09-02'); // Monday
            const currentDate = new Date('2024-09-09');
            expect(getWeekParity(startDate, currentDate)).toBe(2);
        });
    });
});

describe('transformSemesterDate function', () => {
    it('should correctly transform date string from DD/MM/YYYY to Date object', () => {
        const result = transformSemesterDate('02/09/2024');
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(8); // 0-indexed
        expect(result.getDate()).toBe(2);
    });

    it('should correctly transform date with single digit day and month', () => {
        const result = transformSemesterDate('01/01/2024');
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(0);
        expect(result.getDate()).toBe(1);
    });

    it('should correctly transform end of year date', () => {
        const result = transformSemesterDate('31/12/2024');
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(11);
        expect(result.getDate()).toBe(31);
    });

    it('should return Invalid Date for incorrect format', () => {
        const result = transformSemesterDate('2024-09-02');
        expect(isNaN(result.getTime())).toBe(true);
    });
});