import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoomCard from './RoomCard';

const showConfirmDialog = jest.fn();
const setSelectRoom = jest.fn();

const props = {
    room: {
        id: 73,
        name: 'Пара проводиться онлайн',
        type: {
            id: 25,
            description: 'Лекційна',
        },
    },
    showConfirmDialog,
    setSelectRoom,
    isDisabled: true,
};

describe('behavior of RoomCard Component when room is disabled', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(<RoomCard {...props} />);
    });

    it('should render Set Enabled and Delete icons if disabled is true', () => {
        expect(screen.getByTitle('common:set_enabled')).toBeInTheDocument();
        expect(screen.getByText('Пара проводиться онлайн')).toBeInTheDocument();
    });

    it('should call showConfirmDialog when click Set Enabled icon', () => {
        fireEvent.click(screen.getByTitle('common:set_enabled'));
        expect(showConfirmDialog).toHaveBeenCalledTimes(1);
    });

    it('should call showConfirmDialog when click Delete icon', () => {
        fireEvent.click(document.querySelector('.delete-icon-btn'));
        expect(showConfirmDialog).toHaveBeenCalledTimes(1);
    });
});

describe('behavior of RoomCard Component when room is not disabled', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(<RoomCard {...props} isDisabled={false} />);
    });

    it('should render Set Disabled, Edit and Delete icons if disabled is false', () => {
        expect(screen.getByTitle('common:set_disabled')).toBeInTheDocument();
        expect(document.querySelector('.edit-icon-btn')).toBeInTheDocument();
        expect(document.querySelector('.delete-icon-btn')).toBeInTheDocument();
    });

    it('should call showConfirmDialog when click Set Disabled icon', () => {
        fireEvent.click(screen.getByTitle('common:set_disabled'));
        expect(showConfirmDialog).toHaveBeenCalledTimes(1);
    });

    it('should call setSelectRoom when click Edit icon', () => {
        fireEvent.click(document.querySelector('.edit-icon-btn'));
        expect(setSelectRoom).toHaveBeenCalledTimes(1);
    });
});