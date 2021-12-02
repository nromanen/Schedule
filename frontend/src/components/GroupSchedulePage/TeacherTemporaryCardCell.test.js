import { mount } from 'enzyme';
import React from 'react';
import { places } from '../../constants/places';
import LinkToMeeting from '../LinkToMeeting/LinkToMeeting';

import TeacherTemporaryCardCell from './TeacherTemporaryCardCell';

describe('Testing TeacherTemporaryCardCell component', () => {
    it('renders an empty string without cards prop', () => {
        const wrapper = mount(<TeacherTemporaryCardCell />);
        expect(wrapper.textContent).toBe(undefined);
    });

    it('renders an empty string with empty cards[0] prop', () => {
        const cards = [null];
        const wrapper = mount(<TeacherTemporaryCardCell cards={cards} />);
        expect(wrapper.textContent).toBe(undefined);
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
        const wrapper = mount(<TeacherTemporaryCardCell cards={cards} place={places.TOGETHER} />);
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
        const wrapper = mount(<TeacherTemporaryCardCell cards={cards} place={places.TOGETHER} />);
        expect(
            wrapper.containsMatchingElement(<LinkToMeeting linkToMeeting={cards.linkToMeeting} />),
        ).toEqual(true);
    });
});
