import { getAllDays, getAllClasses, buildMergedTeacherSchedule, mergeCards } from './mergeTeacherSchedules';
import {getReferenceSemester, getWeekKeyForSemester, getWeekParity, transformSemesterDate} from "../utils/dateUtils";

// ─── Date helpers ───────────────────────────────────────────────

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const toDateStr = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Find the most recent Monday on or before today
const getLastMonday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? 6 : day - 1;
    return addDays(today, -diff);
};

const lastMonday = getLastMonday();

// Reference semester: started 2 weeks ago on Monday → even week now
const referenceStart = toDateStr(addDays(lastMonday, -14));

// Same parity: started 2 weeks ago on Wednesday → same week as reference
const sameParity = toDateStr(addDays(lastMonday, -12));

// Short semester: started this week on Saturday → week 1 (odd) → parity differs
const shortStartSaturday = toDateStr(addDays(lastMonday, 5));

// Short semester: started this week on Sunday → week 1 (odd) → parity differs
const shortStartSunday = toDateStr(addDays(lastMonday, 6));


// ─── Test data ──────────────────────────────────────────────────

const makeSemester = (id, startDay, description = '') => ({
    id,
    startDay,
    description,
    endDay: toDateStr(addDays(lastMonday, 90)),
});

const makeSchedule = (semesterId, startDay, oddDays, evenDays) => ({
    semester: makeSemester(semesterId, startDay),
    teacher: { id: 1, name: 'Іван', surname: 'Франко', patronymic: 'Якович', position: 'доцент' },
    odd: {
        days: oddDays,
        classes: [{ id: 1, class_name: '1', startTime: '08:20', endTime: '09:40' }],
        cards: {
            1: oddDays.map(day => ({ day, cards: [{ id: 100, subjectForSite: 'Math', lessonType: 'LECTURE' }] })),
        },
    },
    even: {
        days: evenDays,
        classes: [{ id: 2, class_name: '2', startTime: '09:50', endTime: '11:10' }],
        cards: {
            2: evenDays.map(day => ({ day, cards: [{ id: 200, subjectForSite: 'Physics', lessonType: 'PRACTICAL' }] })),
        },
    },
});

// ─── getReferenceSemester ───────────────────────────────────────

describe('getReferenceSemester', () => {
    it('returns the semester that started earliest', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, shortStartSaturday, ['MONDAY'], ['TUESDAY']);
        const result = getReferenceSemester([s1, s2]);
        expect(result.semester.id).toBe(1);
    });

    it('returns the only semester if there is just one', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const result = getReferenceSemester([s1]);
        expect(result.semester.id).toBe(1);
    });

    it('handles three semesters and picks the earliest', () => {
        const s1 = makeSchedule(1, sameParity, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s3 = makeSchedule(3, shortStartSaturday, ['MONDAY'], ['TUESDAY']);
        const result = getReferenceSemester([s1, s2, s3]);
        expect(result.semester.id).toBe(2);
    });
});

// ─── getWeekKeyForSemester ──────────────────────────────────────

describe('getWeekKeyForSemester', () => {
    it('returns original key when parities match (both started same week)', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, sameParity, ['MONDAY'], ['TUESDAY']);
        const reference = { semester: s1.semester };
        const getKey = getWeekKeyForSemester(s2.semester, reference);
        expect(getKey('odd')).toBe('odd');
        expect(getKey('even')).toBe('even');
    });

    it('swaps odd↔even when zaochny starts on Saturday of current week', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, shortStartSaturday, ['MONDAY'], ['TUESDAY']);
        const reference = { semester: s1.semester };
        const today = addDays(lastMonday, 2); // Wednesday
        const getKey = getWeekKeyForSemester(s2.semester, reference, today);
        expect(getKey('odd')).toBe('even');
        expect(getKey('even')).toBe('odd');
    });

    it('swaps odd↔even when short semester starts on Thursday of current week', () => {
        const longStart  = '11/03/2026';
        const shortStart = '19/03/2026';
        const today      = new Date('2026-03-21');

        const s1 = makeSchedule(1, longStart,  ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, shortStart, ['MONDAY'], ['TUESDAY']);
        const reference = { semester: s1.semester };

        const getKey = getWeekKeyForSemester(s2.semester, reference, today);
        expect(getKey('odd')).toBe('even');
        expect(getKey('even')).toBe('odd');
    });

    it('swaps odd ↔ even when zaochny starts on Sunday of current week', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, shortStartSunday, ['MONDAY'], ['TUESDAY']);
        const reference = { semester: s1.semester };
        const today = addDays(lastMonday, 2); // Wednesday
        const getKey = getWeekKeyForSemester(s2.semester, reference, today);
        expect(getKey('odd')).toBe('even');
        expect(getKey('even')).toBe('odd');
    });
});

// ─── getAllDays ─────────────────────────────────────────────────

describe('getAllDays', () => {
    it('collects unique days from all semesters', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, shortStartSaturday, ['WEDNESDAY'], ['MONDAY']);
        const result = getAllDays([s1, s2]);
        expect(result).toEqual(expect.arrayContaining(['MONDAY', 'TUESDAY', 'WEDNESDAY']));
        expect(result.filter(d => d === 'MONDAY')).toHaveLength(1);
    });
});

// ─── getAllClasses ──────────────────────────────────────────────

describe('getAllClasses', () => {
    it('collects unique classes sorted by start time', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, shortStartSaturday, ['MONDAY'], ['TUESDAY']);
        const result = getAllClasses([s1, s2]);
        expect(result.map(c => c.id)).toEqual([1, 2]);
    });
});

// ─── buildMergedTeacherSchedule ─────────────────────────────────

describe('buildMergedTeacherSchedule', () => {
    it('returns odd, even and referenceSemester', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const result = buildMergedTeacherSchedule([s1]);
        expect(result).toHaveProperty('odd');
        expect(result).toHaveProperty('even');
        expect(result).toHaveProperty('referenceSemester');
    });

    it('merged odd contains days from all semesters', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, shortStartSaturday, ['WEDNESDAY'], ['THURSDAY']);
        const result = buildMergedTeacherSchedule([s1, s2]);
        expect(result.odd.days).toEqual(expect.arrayContaining(['MONDAY', 'WEDNESDAY']));
    });

    it('does not add semesterColor for single semester', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const result = buildMergedTeacherSchedule([s1]);
        const cards = result.odd.cards[1];
        expect(cards[0].cards[0].semesterColor).toBeNull();
    });

    it('adds semesterColor for multiple semesters', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, shortStartSaturday, ['MONDAY'], ['TUESDAY']);
        const result = buildMergedTeacherSchedule([s1, s2]);
        const cards = result.odd.cards[1];
        expect(cards[0].cards[0].semesterColor).not.toBeNull();
    });
});

// ─── mergeCards ─────────────────────────────────────────────────

describe('mergeCards', () => {
    it('merges cards from two semesters into same day/class slot', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, referenceStart, ['MONDAY'], ['TUESDAY']);
        const reference = getReferenceSemester([s1, s2]);
        const result = mergeCards([s1, s2], 'odd', reference);
        // Both semesters have class id=1 on MONDAY — should be merged
        expect(result[1][0].cards).toHaveLength(2);
    });

    it('keeps cards separate when days differ', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, referenceStart, ['WEDNESDAY'], ['THURSDAY']);
        const reference = getReferenceSemester([s1, s2]);
        const result = mergeCards([s1, s2], 'odd', reference);
        expect(result[1]).toHaveLength(2); // MONDAY and WEDNESDAY — separate entries
    });

    it('adds semesterColor to cards when multiple semesters', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const s2 = makeSchedule(2, referenceStart, ['MONDAY'], ['TUESDAY']);
        const reference = getReferenceSemester([s1, s2]);
        const result = mergeCards([s1, s2], 'odd', reference);
        expect(result[1][0].cards[0].semesterColor).not.toBeNull();
    });

    it('does not add semesterColor for single semester', () => {
        const s1 = makeSchedule(1, referenceStart, ['MONDAY'], ['TUESDAY']);
        const reference = getReferenceSemester([s1]);
        const result = mergeCards([s1], 'odd', reference);
        expect(result[1][0].cards[0].semesterColor).toBeNull();
    });
});