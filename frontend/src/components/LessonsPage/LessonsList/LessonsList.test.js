import React from 'react';
import { render, screen } from '@testing-library/react';
import LessonsList from './LessonsList';

jest.mock('./LessonsCard', () => {
    return function MockLessonsCard({ lesson }) {
        return <div data-testid="lessons-card">{lesson.subjectForSite}</div>;
    };
});

const props = {
    lessons: [
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
                id: 92,
                title: '123',
            },
            grouped: false,
        },
    ],
};

describe('behavior of LessonsList Component', () => {
    it('should render LessonsCard component if lessons exists', () => {
        render(<LessonsList {...props} />);
        expect(screen.getAllByTestId('lessons-card')).toHaveLength(1);
    });
});