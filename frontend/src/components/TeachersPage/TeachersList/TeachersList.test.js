import React from 'react';
import { render, screen } from '@testing-library/react';
import TeachersList from './TeachersList';

jest.mock('./TeachersCard', () => {
    return function MockTeachersCard({ teacherItem }) {
        return <div data-testid="teachers-card">{teacherItem.surname}</div>;
    };
});

jest.mock('../../../share/NotFound/NotFound', () => {
    return function MockNotFound() {
        return <div data-testid="not-found" />;
    };
});

const props = {
    visibleItems: [
        {
            id: 1,
            name: 'name',
            surname: 'biga123',
            patronymic: 'biga123',
            position: 'асистент',
            email: 'biga12213@mail.com',
            department: {
                id: 2,
                name: 'Programming',
                disable: false,
            },
        },
    ],
};

describe('behavior of TeachersList Component', () => {
    it('should render NotFound component if visible items are empty', () => {
        render(<TeachersList {...props} visibleItems={[]} />);
        expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });

    it('should render TeachersCard component if visible items are not empty', () => {
        render(<TeachersList {...props} />);
        expect(screen.getAllByTestId('teachers-card')).toHaveLength(1);
    });
});