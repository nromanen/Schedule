import { shallow } from 'enzyme';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { places } from '../../constants/places';
import LinkToMeeting from '../LinkToMeeting/LinkToMeeting';

import TeacherTemporaryCardCell from './TeacherTemporaryCardCell';

describe('Testing TeacherTemporaryCardCell component', () => {
    let container = null;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it('renders an empty string without cards prop', () => {
        act(() => {
            render(<TeacherTemporaryCardCell />, container);
        });
        expect(container.textContent).toBe('');
    });

    it('renders an empty string with empty cards[0] prop', () => {
        const cards = [null];
        act(() => {
            render(<TeacherTemporaryCardCell cards={cards} />, container);
        });
        expect(container.textContent).toBe('');
    });

    it('does not render linkToMeeting child component if card.linkToMeeting is not present', () => {
        const cards = [
            {
                id: 938,
                linkToMeeting: null,
                subjectForSite: 'Бази даних та знань',
                lessonType: 'LECTURE',
                group: {
                    id: 54,
                    disable: false,
                    title: '24 (202-А)',
                },
                room: '1 к. 18 ауд.',
                temporary_schedule: null,
            },
        ];
        const wrapper = shallow(<TeacherTemporaryCardCell cards={cards} place={places.TOGETHER} />);
        expect(
            wrapper.containsMatchingElement(<LinkToMeeting linkToMeeting={cards.linkToMeeting} />),
        ).not.toEqual(true);
    });

    it('renders linkToMeeting child component if card.linkToMeeting is present', () => {
        const cards = [
            {
                id: 938,
                linkToMeeting: 'https://zoom.us/',
                subjectForSite: 'Бази даних та знань',
                lessonType: 'LECTURE',
                group: {
                    id: 54,
                    disable: false,
                    title: '24 (202-А)',
                },
                room: '1 к. 18 ауд.',
                temporary_schedule: null,
            },
        ];
        const wrapper = shallow(<TeacherTemporaryCardCell cards={cards} place={places.TOGETHER} />);
        expect(
            wrapper.containsMatchingElement(<LinkToMeeting linkToMeeting={cards.linkToMeeting} />),
        ).toEqual(true);
    });
});
