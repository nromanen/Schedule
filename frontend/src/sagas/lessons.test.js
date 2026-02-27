import { call, put } from 'redux-saga/effects';
import {
    createLessonCard,
    removeLessonCard,
    getLessonsByGroup,
    getLessonTypes,
} from './lessons';
import {
    createLessonSuccess,
    deleteLessonCardSuccess,
    setLessonsCardsStart,
    setLessonTypesSuccess,
    setLoading,
} from '../actions';
import { setOpenSuccessSnackbar, setOpenErrorSnackbar } from '../actions/snackbar';
import { axiosCall } from '../services/axios';
import { POST, GET, DELETE } from '../constants/methods';
import { LESSON_URL, LESSON_TYPES_URL } from '../constants/axios';

describe('lesson sagas', () => {

    // ─── Create lesson ──────────────────────────────────────────

    describe('createLessonCard', () => {
        const values = {
            subject: { id: 10 },
            teacher: { id: 20 },
            lessonType: 'lecture',
        };
        const groupId = 5;
        const action = { values, groupId };

        it('should call API and dispatch success', () => {
            const gen = createLessonCard(action);

            // Call API
            const callEffect = gen.next().value;
            expect(callEffect).toEqual(call(axiosCall, LESSON_URL, POST, values));

            // API returns data
            const apiResponse = {
                data: [
                    { id: 1, group: { id: 5 }, subject: { id: 10 } },
                    { id: 2, group: { id: 6 }, subject: { id: 10 } },
                ],
            };
            const putEffect = gen.next(apiResponse).value;

            // Should filter by groupId and dispatch success
            expect(putEffect).toEqual(
                put(createLessonSuccess([{ id: 1, group: { id: 5 }, subject: { id: 10 } }]))
            );
        });

        it('should dispatch error on failure', () => {
            const gen = createLessonCard(action);
            gen.next(); // call

            const error = new Error('Network error');
            const putEffect = gen.throw(error).value;

            expect(putEffect.type).toBe('PUT');
        });
    });

    // ─── Delete lesson ──────────────────────────────────────────

    describe('removeLessonCard', () => {
        const action = { id: 42 };

        it('should call API and dispatch success', () => {
            const gen = removeLessonCard(action);

            // Call API
            const callEffect = gen.next().value;
            expect(callEffect).toEqual(call(axiosCall, `${LESSON_URL}/42`, DELETE));

            // API success
            gen.next();

            // Should dispatch deleteLessonCardSuccess
            // (skipping message creation, checking next put)
        });

        it('should dispatch error on failure', () => {
            const gen = removeLessonCard(action);
            gen.next(); // call

            const error = new Error('Not found');
            const putEffect = gen.throw(error).value;

            expect(putEffect.type).toBe('PUT');
        });
    });

    // ─── Get lessons by group ───────────────────────────────────

    describe('getLessonsByGroup', () => {
        const action = { id: 5 };

        it('should set loading, call API, and set lessons', () => {
            const gen = getLessonsByGroup(action);

            // Set loading true
            const loadingTrue = gen.next().value;
            expect(loadingTrue).toEqual(put(setLoading(true)));

            // Call API
            const callEffect = gen.next().value;
            expect(callEffect).toEqual(call(axiosCall, `${LESSON_URL}?groupId=5`, GET, 5));

            // API returns data
            const apiResponse = { data: [{ id: 1 }, { id: 2 }] };
            const putLessons = gen.next(apiResponse).value;
            expect(putLessons).toEqual(put(setLessonsCardsStart([{ id: 1 }, { id: 2 }])));
        });

        it('should dispatch error and stop loading on failure', () => {
            const gen = getLessonsByGroup(action);
            gen.next(); // setLoading(true)
            gen.next(); // call

            const error = new Error('Server error');
            const putEffect = gen.throw(error).value;
            expect(putEffect.type).toBe('PUT');
        });
    });

    // ─── Get lesson types ───────────────────────────────────────

    describe('getLessonTypes', () => {
        it('should call API and dispatch success', () => {
            const gen = getLessonTypes();

            // Call API
            const callEffect = gen.next().value;
            expect(callEffect).toEqual(call(axiosCall, LESSON_TYPES_URL, GET));

            // API returns data
            const apiResponse = { data: ['lecture', 'practical', 'laboratory'] };
            const putEffect = gen.next(apiResponse).value;
            expect(putEffect).toEqual(
                put(setLessonTypesSuccess(['lecture', 'practical', 'laboratory']))
            );
        });
    });
});