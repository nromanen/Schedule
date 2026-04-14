import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';

// ─── Mock i18n ──────────────────────────────────────────────────

jest.mock('../i18n', () => ({
    t: (key, defaultValue) => defaultValue || key,
    use: () => ({ use: () => ({ use: () => ({ init: jest.fn() }) }) }),
    language: 'uk',
    changeLanguage: jest.fn(),
    init: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, defaultValue) => defaultValue || key,
        i18n: {
            language: 'uk',
            changeLanguage: jest.fn(),
        },
    }),
    withTranslation: () => (Component) => Component,
    initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

// ─── Mock axios ─────────────────────────────────────────────────

jest.mock('../services/axios', () => ({
    axiosCall: jest.fn(() => Promise.resolve({ data: {} })),
}));

// ─── Minimal Redux store ────────────────────────────────────────

const createTestStore = (overrides = {}) => {
    const defaultState = {
        lesson: {
            lessons: [],
            lessonTypes: [],
            groupId: null,
            uniqueError: false,
        },
        teachers: { teachers: [] },
        groups: {
            groups: [],
            scheduleGroups: [],
            group: {},
        },
        subjects: { subjects: [] },
        loadingIndicator: { loading: false, semesterLoading: false },
        semesters: { semesters: [] },
        schedule: {
            currentSemester: { id: 1, description: '1 семестр 25/26' },
            defaultSemester: { id: 1, description: '1 семестр 25/26' },
        },
        dialog: { isOpenConfirmDialog: false },
        classActions: { classScheduler: [] },
        snackbar: {},
        ...overrides,
    };

    return createStore((state = defaultState) => state);
};

// ─── Helper render ──────────────────────────────────────────────

const renderWithProviders = (ui, storeOverrides = {}) => {
    const store = createTestStore(storeOverrides);
    return render(
        <Provider store={store}>
            <MemoryRouter>
                {ui}
            </MemoryRouter>
        </Provider>
    );
};

// ─── Tests ──────────────────────────────────────────────────────

describe('Smoke tests: components render without crashing', () => {

    describe('SchedulePublishBanner', () => {
        it('renders without crashing', async () => {
            const SchedulePublishBanner = require('../components/GroupSchedulePage/SchedulePublishBanner/SchedulePublishBanner').default;
            const { container } = renderWithProviders(<SchedulePublishBanner />);
            expect(container).toBeTruthy();
        });
    });

    describe('CalendarSchedule', () => {
        it('renders with minimal props', () => {
            const CalendarSchedule = require('../components/CalendarSchedule/CalendarSchedule').default;
            const fullSchedule = {
                semester: {
                    startDay: '23/02/2026',
                    endDay: '06/03/2026',
                    description: 'Заочний семестр',
                    semester_days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
                    semester_classes: [
                        { id: 1, class_name: '1', startTime: '08:20', endTime: '09:40' },
                    ],
                },
                groupList: [{ id: 1, title: '101(з)' }],
                semesterClasses: [
                    { id: 1, class_name: '1', startTime: '08:20', endTime: '09:40' },
                ],
                resultArray: [
                    {
                        day: 'MONDAY',
                        classes: [
                            {
                                class: { id: 1, class_name: '1', startTime: '08:20', endTime: '09:40' },
                                cards: {
                                    odd: [{ group: { id: 1 }, card: null }],
                                    even: [{ group: { id: 1 }, card: null }],
                                },
                            },
                        ],
                    },
                ],
            };

            const { container } = renderWithProviders(
                <CalendarSchedule
                    fullSchedule={fullSchedule}
                    viewMode="all"
                    setViewMode={jest.fn()}
                    isManager={false}
                    t={(key, defaultValue) => defaultValue || key}
                />
            );
            expect(container).toBeTruthy();
        });

        it('renders in today mode', () => {
            const CalendarSchedule = require('../components/CalendarSchedule/CalendarSchedule').default;
            const fullSchedule = {
                semester: {
                    startDay: '23/02/2026',
                    endDay: '06/03/2026',
                    description: 'Заочний семестр',
                    semester_days: ['MONDAY'],
                    semester_classes: [],
                },
                groupList: [],
                semesterClasses: [],
                resultArray: [],
            };

            const { container } = renderWithProviders(
                <CalendarSchedule
                    fullSchedule={fullSchedule}
                    viewMode="today"
                    setViewMode={jest.fn()}
                    isManager={false}
                    t={(key, defaultValue) => defaultValue || key}
                />
            );
            expect(container).toBeTruthy();
        });
    });

    describe('ViewModeToggle', () => {
        it('renders with all mode active', () => {
            const { ViewModeToggle } = require('../components/ScheduleView/ScheduleView');
            const { container } = renderWithProviders(
                <ViewModeToggle
                    viewMode="all"
                    setViewMode={jest.fn()}
                    t={(key, defaultValue) => defaultValue || key}
                />
            );
            expect(container.querySelectorAll('.schedule-view-toggle__btn')).toHaveLength(2);
        });

        it('renders with today mode active', () => {
            const { ViewModeToggle } = require('../components/ScheduleView/ScheduleView');
            const { container } = renderWithProviders(
                <ViewModeToggle
                    viewMode="today"
                    setViewMode={jest.fn()}
                    t={(key, defaultValue) => defaultValue || key}
                />
            );
            const activeBtn = container.querySelector('.schedule-view-toggle__btn.active');
            expect(activeBtn).toBeTruthy();
        });
    });
});