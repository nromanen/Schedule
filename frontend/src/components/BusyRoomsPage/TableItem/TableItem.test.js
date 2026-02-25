import React from 'react';
import { render } from '@testing-library/react';
import TableItem from './TableItem';

const props = {
    index: '071',
    classes: [
        {
            id: 1,
            startTime: '08:19',
            endTime: '09:39',
            class_name: '1',
        },
    ],
    schedule: {
        day: 'MONDAY',
        classes: [
            {
                even: [
                    {
                        lessons: [
                            {
                                groups: [
                                    {
                                        group_id: 33,
                                        group_name: '17 (108)',
                                    },
                                ],
                                subject_for_site: 'Аналітична геометрія',
                                lesson_type: 'PRACTICAL',
                                teacher_for_site: 'Мироник',
                            },
                        ],
                        class_id: 1,
                        class_name: '1',
                    },
                ],
                odd: [],
            },
        ],
    },
};

describe('<TableItem />', () => {
    it('should render empty TableItem if classes array empty', () => {
        const { container } = render(<TableItem classes={[]} />);
        expect(container.innerHTML).toBe('');
    });

    it('should render odd and even table item', () => {
        const { container } = render(<TableItem {...props} />);
        expect(container.querySelectorAll('.class-info-container')).toHaveLength(2);
    });

    it('should render even card with group name', () => {
        const { container } = render(<TableItem {...props} />);
        expect(container.querySelectorAll('.group-list')).toHaveLength(1);
    });
});
