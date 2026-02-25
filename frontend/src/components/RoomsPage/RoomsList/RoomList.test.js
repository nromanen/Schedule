import React from 'react';
import { render, screen } from '@testing-library/react';
import RoomList from './RoomsList';

jest.mock('./RoomCard/RoomCard', () => {
    return function MockRoomCard({ room }) {
        return <div data-testid="room-card">{room.name}</div>;
    };
});

jest.mock('../../../share/NotFound/NotFound', () => {
    return function MockNotFound() {
        return <div data-testid="not-found" />;
    };
});

jest.mock('../../../share/DraggableCard/DraggableCard', () => ({
    DraggableCard: function MockDraggableCard({ children }) {
        return <div data-testid="draggable-card">{children}</div>;
    },
}));

const props = {
    loading: false,
    isDisabled: false,
    rooms: [
        {
            id: 55,
            name: '1 к. 19 аудиторія',
            disable: false,
            type: {
                id: 26,
                description: 'Практична',
            },
        },
    ],
    term: '',
};

describe('behavior of RoomList Component', () => {
    it('should render loading if "loading:true"', () => {
        render(<RoomList {...props} loading />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render NotFound component if visible items are empty', () => {
        render(<RoomList {...props} loading={false} rooms={[]} />);
        expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });

    it('should render RoomCard component if visible items are not empty', () => {
        render(<RoomList {...props} />);
        expect(screen.getByTestId('room-card')).toBeInTheDocument();
    });
});
