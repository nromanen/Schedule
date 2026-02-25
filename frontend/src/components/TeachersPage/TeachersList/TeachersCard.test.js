import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeachersCard from './TeachersCard';
import { dialogTypes } from '../../../constants/dialogs';

const showConfirmDialog = jest.fn();
const selectedTeacherCard = jest.fn();

const props = {
    teacherItem: {
        id: 1,
        name: 'name',
        surname: 'surname',
        patronymic: 'patronymic',
        position: 'position',
        department: { name: 'departmentName' },
        email: 'test@gmail.com',
    },
    isDisabled: true,
    showConfirmDialog,
    selectedTeacherCard,
};

const props2 = {
    teacherItem: {
        id: 1,
        name: 'name',
        surname: 'surname',
        patronymic: 'patronymic',
        position: 'position',
        department: null,
        email: null,
    },
    isDisabled: true,
    showConfirmDialog,
    selectedTeacherCard,
};

const renderTeachersCard = (overrideProps = {}) => {
    return render(<TeachersCard {...props} {...overrideProps} />);
};

describe('behaviour TeachersCard when teacher is disabled', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderTeachersCard();
    });

    it('should render Set Enabled and Delete icons if disabled is true', () => {
        expect(screen.getByTitle('common:set_enabled')).toBeInTheDocument();
        expect(screen.getByTitle('common:delete_hover_title')).toBeInTheDocument();
    });

    it('should call showConfirmDialog when click Set Enabled icon', () => {
        fireEvent.click(screen.getByTitle('common:set_enabled'));
        expect(showConfirmDialog).toHaveBeenCalledWith(
            props.teacherItem.id,
            dialogTypes.SET_VISIBILITY_ENABLED,
        );
    });

    it('should call showConfirmDialog when click Delete icon', () => {
        fireEvent.click(screen.getByTitle('common:delete_hover_title'));
        expect(showConfirmDialog).toHaveBeenCalledWith(
            props.teacherItem.id,
            dialogTypes.DELETE_CONFIRM,
        );
    });
});

describe('behaviour TeachersCard when teacher is not disabled', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderTeachersCard({ isDisabled: false });
    });

    it('should render Set Disabled, Edit and Delete icons if disabled is false', () => {
        expect(screen.getByTitle('common:set_disabled')).toBeInTheDocument();
        expect(screen.getByTitle('common:edit_hover_title')).toBeInTheDocument();
        expect(screen.getByTitle('common:delete_hover_title')).toBeInTheDocument();
    });

    it('should call showConfirmDialog when click Set Disabled icon', () => {
        fireEvent.click(screen.getByTitle('common:set_disabled'));
        expect(showConfirmDialog).toHaveBeenCalledWith(
            props.teacherItem.id,
            dialogTypes.SET_VISIBILITY_DISABLED,
        );
    });

    it('should call selectedTeacherCard when click Edit icon', () => {
        fireEvent.click(screen.getByTitle('common:edit_hover_title'));
        expect(selectedTeacherCard).toHaveBeenCalledWith(props.teacherItem.id);
    });

    it('should have correct teacher full name', () => {
        const { surname, name, patronymic } = props.teacherItem;
        expect(screen.getByText(`${surname} ${name} ${patronymic}`)).toBeInTheDocument();
    });

    it('should have correct teacher title', () => {
        const { position, department } = props.teacherItem;
        expect(screen.getByText(`${position} teacher_department ${department.name}`)).toBeInTheDocument();
    });

    it('should render email if email passed', () => {
        expect(screen.getByText(props.teacherItem.email)).toBeInTheDocument();
    });
});

describe('behaviour card if teacher no department or email', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(<TeachersCard {...props2} />);
    });

    it('should not render email', () => {
        expect(screen.queryByText('test@gmail.com')).not.toBeInTheDocument();
    });

    it('should have only position in title if department is null', () => {
        expect(screen.getByText(`${props2.teacherItem.position}`)).toBeInTheDocument();
    });
});