import { mount } from 'enzyme';
import React from 'react';
import { places } from '../../constants/places';
import LinkToMeeting from '../LinkToMeeting/LinkToMeeting';

import LessonTemporaryCardCell from './LessonTemporaryCardCell';

describe('Testing TeacherTemporaryCardCell component', () => {
    it('renders an empty string without card prop', () => {
        const wrapper = mount(<LessonTemporaryCardCell />);
        expect(wrapper.textContent).toBe(undefined);
    });

    it('does not render linkToMeeting child component if card.linkToMeeting is not present', () => {
        const card = {
            teacher: {
                id: 47,
                disable: false,
                name: 'Наталія',
                surname: 'Шевчук',
                patronymic: 'Михайлівна',
                position: 'асистент',
                email: null,
                department: null,
            },
            subjectForSite: 'Лінійна алгебра',
            lessonType: 'PRACTICAL',
            room: {
                id: 68,
                name: '1 к. 39 ауд.',
            },
            temporary_schedule: null,
        };
        const wrapper = mount(<LessonTemporaryCardCell card={card} place={places.TOGETHER} />);
        expect(
            wrapper.containsMatchingElement(<LinkToMeeting linkToMeeting={card.linkToMeeting} />),
        ).not.toEqual(true);
    });

    it('renders linkToMeeting child component if card.linkToMeeting is present', () => {
        const card = {
            teacher: {
                id: 47,
                disable: false,
                name: 'Наталія',
                surname: 'Шевчук',
                patronymic: 'Михайлівна',
                position: 'асистент',
                email: null,
                department: null,
            },
            linkToMeeting: 'https://zoom.us/',
            subjectForSite: 'Лінійна алгебра',
            lessonType: 'PRACTICAL',
            room: {
                id: 68,
                name: '1 к. 39 ауд.',
            },
            temporary_schedule: null,
        };
        const wrapper = mount(<LessonTemporaryCardCell card={card} place={places.TOGETHER} />);
        expect(
            wrapper.containsMatchingElement(<LinkToMeeting linkToMeeting={card.linkToMeeting} />),
        ).toEqual(true);
    });
});
