import reducer from './lesson';
import * as actionTypes from '../actions/actionsType';

describe('lesson reducer', () => {
    const initialState = {
        lessons: [],
        lessonTypes: [],
        lesson: {},
        groupId: null,
        uniqueError: false,
    };

    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    // ─── Create ─────────────────────────────────────────────────

    describe('CREATE_LESSON_CARD_SUCCESS', () => {
        it('should add new lessons to list', () => {
            const newLessons = [
                { id: 1, subject: { id: 10 }, teacher: { id: 20 }, lessonType: 'lecture' },
            ];

            const result = reducer(initialState, {
                type: actionTypes.CREATE_LESSON_CARD_SUCCESS,
                result: newLessons,
            });

            expect(result.lessons).toHaveLength(1);
            expect(result.lessons[0].id).toBe(1);
        });

        it('should append to existing lessons', () => {
            const state = {
                ...initialState,
                lessons: [{ id: 1, subject: { id: 10 } }],
            };
            const newLessons = [{ id: 2, subject: { id: 11 } }];

            const result = reducer(state, {
                type: actionTypes.CREATE_LESSON_CARD_SUCCESS,
                result: newLessons,
            });

            expect(result.lessons).toHaveLength(2);
        });
    });

    // ─── Read ───────────────────────────────────────────────────

    describe('SET_LESSONS_CARDS_START', () => {
        it('should replace lessons list', () => {
            const state = {
                ...initialState,
                lessons: [{ id: 1 }, { id: 2 }],
            };
            const newLessons = [{ id: 10 }, { id: 11 }, { id: 12 }];

            const result = reducer(state, {
                type: actionTypes.SET_LESSONS_CARDS_START,
                result: newLessons,
            });

            expect(result.lessons).toHaveLength(3);
            expect(result.lessons).toEqual(newLessons);
        });
    });

    describe('SET_LESSON_TYPES_SUCCESS', () => {
        it('should set lesson types', () => {
            const types = ['lecture', 'practical', 'laboratory'];

            const result = reducer(initialState, {
                type: actionTypes.SET_LESSON_TYPES_SUCCESS,
                result: types,
            });

            expect(result.lessonTypes).toEqual(types);
        });
    });

    // ─── Update ─────────────────────────────────────────────────

    describe('UPDATE_LESSON_CARD_SUCCESS', () => {
        it('should update existing lesson', () => {
            const state = {
                ...initialState,
                lessons: [
                    { id: 1, subject: { id: 10 }, lessonType: 'lecture' },
                    { id: 2, subject: { id: 11 }, lessonType: 'practical' },
                ],
                lesson: { id: 1 },
            };

            const result = reducer(state, {
                type: actionTypes.UPDATE_LESSON_CARD_SUCCESS,
                result: { id: 1, subject: { id: 10 }, lessonType: 'laboratory' },
            });

            expect(result.lessons[0].lessonType).toBe('laboratory');
            expect(result.lessons[1].lessonType).toBe('practical');
            expect(result.lesson).toEqual({});
        });

        it('should not affect other lessons', () => {
            const state = {
                ...initialState,
                lessons: [
                    { id: 1, lessonType: 'lecture' },
                    { id: 2, lessonType: 'practical' },
                ],
            };

            const result = reducer(state, {
                type: actionTypes.UPDATE_LESSON_CARD_SUCCESS,
                result: { id: 1, lessonType: 'laboratory' },
            });

            expect(result.lessons[1]).toEqual({ id: 2, lessonType: 'practical' });
        });
    });

    // ─── Delete ─────────────────────────────────────────────────

    describe('DELETE_LESSON_CARD_SUCCESS', () => {
        it('should remove lesson by id', () => {
            const state = {
                ...initialState,
                lessons: [
                    { id: 1, subject: { id: 10 } },
                    { id: 2, subject: { id: 11 } },
                    { id: 3, subject: { id: 12 } },
                ],
            };

            const result = reducer(state, {
                type: actionTypes.DELETE_LESSON_CARD_SUCCESS,
                id: 2,
            });

            expect(result.lessons).toHaveLength(2);
            expect(result.lessons.find(l => l.id === 2)).toBeUndefined();
        });

        it('should not crash when deleting non-existent id', () => {
            const state = {
                ...initialState,
                lessons: [{ id: 1 }],
            };

            const result = reducer(state, {
                type: actionTypes.DELETE_LESSON_CARD_SUCCESS,
                id: 999,
            });

            expect(result.lessons).toHaveLength(1);
        });
    });

    // ─── Select ─────────────────────────────────────────────────

    describe('SELECT_LESSON_CARD_SUCCESS', () => {
        it('should select lesson by id', () => {
            const state = {
                ...initialState,
                lessons: [
                    { id: 1, lessonType: 'lecture' },
                    { id: 2, lessonType: 'practical' },
                ],
            };

            const result = reducer(state, {
                type: actionTypes.SELECT_LESSON_CARD_SUCCESS,
                cardId: 2,
            });

            expect(result.lesson).toEqual({ id: 2, lessonType: 'practical' });
        });

        it('should return {id: null} for non-existent id', () => {
            const state = {
                ...initialState,
                lessons: [{ id: 1 }],
            };

            const result = reducer(state, {
                type: actionTypes.SELECT_LESSON_CARD_SUCCESS,
                cardId: 999,
            });

            expect(result.lesson).toEqual({ id: null });
        });

        it('should clear selection when cardId is null', () => {
            const state = {
                ...initialState,
                lessons: [{ id: 1 }],
                lesson: { id: 1 },
            };

            const result = reducer(state, {
                type: actionTypes.SELECT_LESSON_CARD_SUCCESS,
                cardId: null,
            });

            expect(result.lesson).toEqual({ id: null });
        });
    });

    // ─── Group selection ────────────────────────────────────────

    describe('SELECT_GROUP_ID', () => {
        it('should set groupId and clear lesson', () => {
            const state = {
                ...initialState,
                lesson: { id: 1, lessonType: 'lecture' },
                groupId: null,
            };

            const result = reducer(state, {
                type: actionTypes.SELECT_GROUP_ID,
                id: 42,
            });

            expect(result.groupId).toBe(42);
            expect(result.lesson).toEqual({});
        });
    });

    // ─── Unique error ───────────────────────────────────────────

    describe('SET_UNIQUE_ERROR', () => {
        it('should set uniqueError to true', () => {
            const result = reducer(initialState, {
                type: actionTypes.SET_UNIQUE_ERROR,
                result: true,
            });

            expect(result.uniqueError).toBe(true);
        });

        it('should set uniqueError to false', () => {
            const state = { ...initialState, uniqueError: true };

            const result = reducer(state, {
                type: actionTypes.SET_UNIQUE_ERROR,
                result: false,
            });

            expect(result.uniqueError).toBe(false);
        });
    });
});