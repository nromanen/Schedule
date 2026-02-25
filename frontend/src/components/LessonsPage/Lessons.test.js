import React from 'react';
import { render, screen } from '@testing-library/react';
import Lessons from './Lessons';

jest.mock('./LessonsList/LessonsList', () => {
    return function MockLessonsList() {
        return <div data-testid="lessons-list" />;
    };
});

const onClickOpen = jest.fn();
const onSelectLesson = jest.fn();
const onCopyLesson = jest.fn();

const props = {
    loading: false,
    groupId: 12,
    onClickOpen,
    onSelectLesson,
    onCopyLesson,
    group: {
        id: 4,
        title: '123',
    },
    visibleItems: [
        {
            id: 6256,
            hours: 2,
            linkToMeeting: null,
            subjectForSite: 'Web-технології та Web-програмування',
            lessonType: 'LABORATORY',
            subject: {
                id: 47,
                name: 'Web-технології та Web-програмування',
                disable: false,
            },
            teacher: {
                id: 69,
                name: 'Степан',
                surname: 'Блажевський',
                patronymic: 'Григорович Григорович',
                position: 'доцент',
                email: null,
                department: null,
            },
            semesterId: null,
            group: {
                id: 4,
                title: '123',
            },
            grouped: false,
        },
    ],
};

describe('behavior of Lessons Component', () => {
    it('should render loading if "loading:true"', () => {
        render(<Lessons {...props} loading />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render h2 text if visible items are empty', () => {
        render(<Lessons {...props} loading={false} visibleItems={[]} />);
        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should render LessonsList component if visible items are not empty', () => {
        render(<Lessons {...props} loading={false} />);
        expect(screen.getByTestId('lessons-list')).toBeInTheDocument();
    });
});