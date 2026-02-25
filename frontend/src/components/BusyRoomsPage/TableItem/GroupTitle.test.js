import React from 'react';
import { render, screen } from '@testing-library/react';
import { GroupTitle } from './GroupTitle';

const props = {
    lessonArray: [
        {
            subject_for_site: 'Web-дизайн',
            teacher_for_site: 'teacher',
            groups: [
                {
                    group_name: '152',
                },
            ],
        },
    ],
};

describe('GroupTitle', () => {
    it('renders GroupTitle with props', () => {
        const { container } = render(<GroupTitle {...props} />);
        expect(container.querySelectorAll('.group-list')).toHaveLength(1);
        expect(screen.getByTitle('teacher / Web-дизайн')).toBeInTheDocument();
        expect(screen.getByText('152')).toBeInTheDocument();
    });
});