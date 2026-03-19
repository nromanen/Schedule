import { makeTeacherSchedule } from './teacherScheduleMapper';

// ─── Test data ──────────────────────────────────────────────────

const makeSemester = (id) => ({
    id,
    description: `Semester ${id}`,
    startDay: '19/01/2026',
    endDay: '30/06/2026',
});

const makeTeacher = () => ({
    id: 1,
    name: 'Іван',
    surname: 'Франко',
    patronymic: 'Якович',
    position: 'доцент',
});

const makeDay = (day) => ({
    day,
    odd: {
        classes: [{
            class: { id: 1, class_name: '1', startTime: '08:20', endTime: '09:40' },
            lessons: [{ id: 100, subjectForSite: 'Math', lessonType: 'LECTURE' }],
        }],
    },
    even: {
        classes: [{
            class: { id: 2, class_name: '2', startTime: '09:50', endTime: '11:10' },
            lessons: [{ id: 200, subjectForSite: 'Physics', lessonType: 'PRACTICAL' }],
        }],
    },
});

const makeSingleSchedule = (semesterId) => ({
    semester: makeSemester(semesterId),
    teacher: makeTeacher(),
    days: [makeDay('MONDAY'), makeDay('TUESDAY')],
});

// ─── makeTeacherSchedule ────────────────────────────────────────

describe('makeTeacherSchedule', () => {
    describe('backward compatibility — single object input', () => {
        it('wraps single object in array and returns array with one element', () => {
            const result = makeTeacherSchedule(makeSingleSchedule(1));
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
        });

        it('correctly maps semester and teacher', () => {
            const result = makeTeacherSchedule(makeSingleSchedule(1));
            expect(result[0].semester.id).toBe(1);
            expect(result[0].teacher.id).toBe(1);
        });
    });

    describe('array input — multiple semesters', () => {
        it('returns array with same length as input', () => {
            const result = makeTeacherSchedule([
                makeSingleSchedule(1),
                makeSingleSchedule(2),
            ]);
            expect(result).toHaveLength(2);
        });

        it('maps each semester correctly', () => {
            const result = makeTeacherSchedule([
                makeSingleSchedule(1),
                makeSingleSchedule(2),
            ]);
            expect(result[0].semester.id).toBe(1);
            expect(result[1].semester.id).toBe(2);
        });
    });

    describe('odd/even mapping', () => {
        it('maps odd days correctly', () => {
            const result = makeTeacherSchedule(makeSingleSchedule(1));
            expect(result[0].odd.days).toEqual(expect.arrayContaining(['MONDAY', 'TUESDAY']));
        });

        it('maps even days correctly', () => {
            const result = makeTeacherSchedule(makeSingleSchedule(1));
            expect(result[0].even.days).toEqual(expect.arrayContaining(['MONDAY', 'TUESDAY']));
        });

        it('maps odd classes sorted by start time', () => {
            const result = makeTeacherSchedule(makeSingleSchedule(1));
            expect(result[0].odd.classes[0].startTime).toBe('08:20');
        });

        it('maps odd cards with correct structure', () => {
            const result = makeTeacherSchedule(makeSingleSchedule(1));
            const cards = result[0].odd.cards[1];
            expect(cards[0].day).toBe('MONDAY');
            expect(cards[0].cards[0].subjectForSite).toBe('Math');
        });

        it('maps even cards with correct structure', () => {
            const result = makeTeacherSchedule(makeSingleSchedule(1));
            const cards = result[0].even.cards[2];
            expect(cards[0].day).toBe('MONDAY');
            expect(cards[0].cards[0].subjectForSite).toBe('Physics');
        });
    });

    describe('empty days', () => {
        it('returns empty odd and even when days is empty', () => {
            const schedule = { ...makeSingleSchedule(1), days: [] };
            const result = makeTeacherSchedule(schedule);
            expect(result[0].odd).toEqual({});
            expect(result[0].even).toEqual({});
        });
    });
});