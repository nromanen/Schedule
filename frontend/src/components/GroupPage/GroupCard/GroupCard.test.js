import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GroupCard from './GroupCard';

const showAddStudentDialog = jest.fn();
const showStudentsByGroup = jest.fn();
const showConfirmDialog = jest.fn();
const setGroup = jest.fn();

const props = {
    group: {
        id: 116,
        title: '100',
    },
    showAddStudentDialog,
    showStudentsByGroup,
    showConfirmDialog,
    setGroup,
    disabled: true,
};

const renderGroupCard = (overrideProps = {}) => {
    return render(
        <BrowserRouter>
            <GroupCard {...props} {...overrideProps} />
        </BrowserRouter>,
    );
};

describe('behavior of GroupCard Component when group is disabled', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderGroupCard();
    });

    it('should render Set Enabled, Add Student and Delete icons if disabled is true', () => {
        expect(screen.getByTitle('common:set_enabled')).toBeInTheDocument();
        expect(screen.getByTitle('formElements:student_add_label')).toBeInTheDocument();
        expect(screen.getByTitle('delete_title')).toBeInTheDocument();
    });

    it('should call showConfirmDialog when click Set Enabled icon', () => {
        fireEvent.click(screen.getByTitle('common:set_enabled'));
        expect(showConfirmDialog).toHaveBeenCalledTimes(1);
    });

    it('should call showConfirmDialog when click Delete icon', () => {
        fireEvent.click(screen.getByTitle('delete_title'));
        expect(showConfirmDialog).toHaveBeenCalledTimes(1);
    });

    it('should call showAddStudentDialog when click Add Student icon', () => {
        fireEvent.click(screen.getByTitle('formElements:student_add_label'));
        expect(showAddStudentDialog).toHaveBeenCalledTimes(1);
    });
});

describe('behavior of GroupCard Component when group is not disabled', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderGroupCard({ disabled: false });
    });

    it('should render Set Disabled, Edit, Delete, Add Student and Show Students icons', () => {
        expect(screen.getByTitle('common:set_disabled')).toBeInTheDocument();
        expect(screen.getByTitle('common:edit')).toBeInTheDocument();
        expect(screen.getByTitle('delete_title')).toBeInTheDocument();
        expect(screen.getByTitle('formElements:student_add_label')).toBeInTheDocument();
        expect(screen.getByTitle('formElements:show_students')).toBeInTheDocument();
    });

    it('should call showConfirmDialog when click Set Disabled icon', () => {
        fireEvent.click(screen.getByTitle('common:set_disabled'));
        expect(showConfirmDialog).toHaveBeenCalledTimes(1);
    });

    it('should call setGroup when click Edit icon', () => {
        fireEvent.click(screen.getByTitle('common:edit'));
        expect(setGroup).toHaveBeenCalledTimes(1);
    });

    it('should call showStudentsByGroup when click Show Students icon', () => {
        fireEvent.click(screen.getByTitle('formElements:show_students'));
        expect(showStudentsByGroup).toHaveBeenCalledTimes(1);
    });
});