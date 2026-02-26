import { checkUniqLesson } from './storeValidation';

describe('checkUniqLesson', () => {
    const existingLessons = [
        {
            id: 1,
            subject: { id: 10 },
            teacher: { id: 20 },
            lessonType: 'lecture',
        },
        {
            id: 2,
            subject: { id: 11 },
            teacher: { id: 21 },
            lessonType: 'practical',
        },
    ];

    describe('creating new lesson (no id)', () => {
        it('should return true if lesson is unique', () => {
            const newLesson = {
                subject: { id: 99 },
                teacher: { id: 99 },
                lessonType: 'lecture',
            };
            expect(checkUniqLesson(existingLessons, newLesson)).toBe(true);
        });

        it('should return false if duplicate exists', () => {
            const newLesson = {
                subject: { id: 10 },
                teacher: { id: 20 },
                lessonType: 'lecture',
            };
            expect(checkUniqLesson(existingLessons, newLesson)).toBe(false);
        });

        it('should return true if same subject and teacher but different type', () => {
            const newLesson = {
                subject: { id: 10 },
                teacher: { id: 20 },
                lessonType: 'practical',
            };
            expect(checkUniqLesson(existingLessons, newLesson)).toBe(true);
        });

        it('should return true if same subject and type but different teacher', () => {
            const newLesson = {
                subject: { id: 10 },
                teacher: { id: 99 },
                lessonType: 'lecture',
            };
            expect(checkUniqLesson(existingLessons, newLesson)).toBe(true);
        });
    });

    describe('editing existing lesson (has id)', () => {
        it('should return true when editing itself (same id)', () => {
            const editLesson = {
                id: 1,
                subject: { id: 10 },
                teacher: { id: 20 },
                lessonType: 'lecture',
            };
            expect(checkUniqLesson(existingLessons, editLesson)).toBe(true);
        });

        it('should return false when editing creates duplicate with another lesson', () => {
            const editLesson = {
                id: 1,
                subject: { id: 11 },
                teacher: { id: 21 },
                lessonType: 'practical',
            };
            expect(checkUniqLesson(existingLessons, editLesson)).toBe(false);
        });

        it('should return true when editing to unique combination', () => {
            const editLesson = {
                id: 1,
                subject: { id: 99 },
                teacher: { id: 99 },
                lessonType: 'laboratory',
            };
            expect(checkUniqLesson(existingLessons, editLesson)).toBe(true);
        });
    });

    describe('edge cases', () => {
        it('should return true when lessons list is empty', () => {
            const newLesson = {
                subject: { id: 10 },
                teacher: { id: 20 },
                lessonType: 'lecture',
            };
            expect(checkUniqLesson([], newLesson)).toBe(true);
        });

        it('should handle string ids (from form inputs)', () => {
            const newLesson = {
                subject: { id: '10' },
                teacher: { id: '20' },
                lessonType: 'lecture',
            };
            expect(checkUniqLesson(existingLessons, newLesson)).toBe(false);
        });
    });
});