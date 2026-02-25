import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('../TableItem/TableItem', () => (props) => <div data-testid="table-item" />);
jest.mock('../../ScheduleTable/ScheduleDaySidebar/ScheduleDaySidebar', () => (props) => <div data-testid="schedule-sidebar" />);

import BusyRoomsTable from './BusyRoomsTable';

const getProps = () => ({
    days: ['MONDAY', 'THURSDAY', 'FRIDAY'],
    columnsSize: 'sm',
    classes: [
        {
            id: 1,
            startTime: '08:19',
            endTime: '09:39',
            class_name: '1',
        },
    ],
    busyRooms: [
        {
            schedules: [
                {
                    day: 'MONDAY',
                    classes: [
                        {
                            even: [
                                {
                                    lessons: [
                                        {
                                            groups: [{ group_id: 31, group_name: '18 (106)' }],
                                            subject_for_site: 'Аналітична геометрія',
                                            lesson_type: 'LECTURE',
                                            teacher_for_site: 'Мироник',
                                        },
                                        {
                                            groups: [{ group_id: 28, group_name: '19 (105)' }],
                                            subject_for_site: 'Актуальні питання історії та культури України',
                                            lesson_type: 'PRACTICAL',
                                            teacher_for_site: 'Дробіна',
                                        },
                                    ],
                                    class_id: 1,
                                    class_name: '1',
                                },
                                {
                                    lessons: [],
                                    class_id: 2,
                                    class_name: '2',
                                },
                            ],
                            odd: [
                                { lessons: [], class_id: 1, class_name: '1' },
                                { lessons: [], class_id: 2, class_name: '2' },
                            ],
                        },
                    ],
                },
            ],
            room_id: 51,
            room_name: '1 к. 11 ауд',
            room_type: 'практична',
        },
    ],
});

describe('<BusyRoomsTable />', () => {
    it('should render BusyRoomsTable with props', () => {
        const { container } = render(<BusyRoomsTable {...getProps()} />);
        expect(container.querySelector('.view-rooms')).toBeInTheDocument();
    });

    it('should render correct room name and title', () => {
        render(<BusyRoomsTable {...getProps()} />);
        const roomTitle = screen.getByTitle('практична');
        expect(roomTitle).toBeInTheDocument();
        expect(roomTitle).toHaveTextContent('1 к. 11 ауд');
    });

    describe('render table item', () => {
        it('should render table item when day matches schedule', () => {
            render(<BusyRoomsTable {...getProps()} />);
            expect(screen.getAllByTestId('table-item')).toHaveLength(1);
        });

        it('should not render table item when no day matches schedule', () => {
            const props = getProps();
            props.days = ['THURSDAY', 'FRIDAY'];
            render(<BusyRoomsTable {...props} />);
            expect(screen.queryByTestId('table-item')).not.toBeInTheDocument();
        });
    });

    it('should render empty view-rooms when no busyRooms', () => {
        const props = getProps();
        props.busyRooms = [];
        const { container } = render(<BusyRoomsTable {...props} />);
        expect(container.querySelector('.view-rooms').children.length).toBe(0);
    });
});