import { isShortSemester } from './CalendarSchedule';

describe('isShortSemester', () => {
    it('should return true for semester ≤ 28 days', () => {
        expect(isShortSemester('23/01/2026', '06/02/2026')).toBe(true); // 14 days
    });

    it('should return true for exactly 28 days', () => {
        expect(isShortSemester('01/01/2026', '29/01/2026')).toBe(true);
    });

    it('should return false for semester > 28 days', () => {
        expect(isShortSemester('23/01/2026', '06/03/2026')).toBe(false); // ~42 days
    });

    it('should return false for regular semester (several months)', () => {
        expect(isShortSemester('01/09/2025', '25/12/2025')).toBe(false);
    });

    it('should return true for very short semester (1 week)', () => {
        expect(isShortSemester('01/02/2026', '07/02/2026')).toBe(true); // 6 days
    });
});