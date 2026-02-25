import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LessonsCard from './LessonsCard';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
    Trans: ({ children, count }) => <span>{count}</span>,
}));

const onClickOpen = jest.fn();
const onSelectLesson = jest.fn();
const onCopyLesson = jest.fn();

const props = {
    lesson: {
        id: 1,
        group: { id: 91, title: '11(А)' },
        grouped: true,
        hours: 2,
        lessonType: 'LABORATORY',
        linkToMeeting: 'http://localhost:3000/admin/lessons',
        subjectForSite: 'Web-дизайн',
        teacher: {
            id: 1,
            name: 'n.',
            surname: 'surname',
            patronymic: 'p.',
            position: 'position',
        },
    },
    onClickOpen,
    onSelectLesson,
    onCopyLesson,
};

describe('LessonsCard component if grouped', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(<LessonsCard {...props} />);
    });

    it('should render FaUserPlus if grouped', () => {
        expect(screen.getByTitle('formElements:grouped_label')).toBeInTheDocument();
        expect(screen.getByTitle('edit_lesson')).toBeInTheDocument();
        expect(screen.getByTitle('delete_lesson')).toBeInTheDocument();
        expect(screen.getByTitle('copy_lesson')).toBeInTheDocument();
    });
});

describe('LessonsCard component if no grouped', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(<LessonsCard {...props} lesson={{ ...props.lesson, grouped: false }} />);
    });

    it('should render FaEdit, MdDelete, MdContentCopy if no grouped', () => {
        expect(screen.getByTitle('edit_lesson')).toBeInTheDocument();
        expect(screen.getByTitle('delete_lesson')).toBeInTheDocument();
        expect(screen.getByTitle('copy_lesson')).toBeInTheDocument();
        expect(screen.queryByTitle('formElements:grouped_label')).not.toBeInTheDocument();
    });

    it('should call onClickOpen when click to Delete icon', () => {
        fireEvent.click(screen.getByTitle('delete_lesson'));
        expect(onClickOpen).toHaveBeenCalledWith(props.lesson.id);
    });

    it('should call onSelectLesson when click to Edit icon', () => {
        fireEvent.click(screen.getByTitle('edit_lesson'));
        expect(onSelectLesson).toHaveBeenCalledWith(props.lesson.id);
    });

    it('should call onCopyLesson when click to Copy icon', () => {
        fireEvent.click(screen.getByTitle('copy_lesson'));
        expect(onCopyLesson).toHaveBeenCalledWith({ ...props.lesson, grouped: false });
    });

    it('should render lesson title', () => {
        expect(screen.getByText('Web-дизайн')).toBeInTheDocument();
    });

    it('should render lesson teacherName surname n. p.', () => {
        expect(screen.getByText('surname n. p.')).toBeInTheDocument();
    });

    it('should render linkToMeeting if link passed', () => {
        expect(screen.getByText(props.lesson.linkToMeeting)).toBeInTheDocument();
    });
});