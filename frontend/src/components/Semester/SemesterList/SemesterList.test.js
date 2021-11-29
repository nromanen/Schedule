import React from 'react';
import { shallow } from 'enzyme';
import SemesterList from './SemesterList';

describe('<SemesterList />', () => {
    it('should render with onClick function', () => {
        const wrapper = shallow(<SemesterList />);
        expect(wrapper.exists()).toBeTruthy();
    });
});
