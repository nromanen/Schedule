import React from 'react';
import { shallow } from 'enzyme';
import { CircularProgress } from '@material-ui/core';
import NotFound from '../../../share/NotFound/NotFound';
import RoomList from './RoomsList';
import RoomCard from './RoomCard/RoomCard';

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
        const wrapper = shallow(<RoomList {...props} loading />);
        expect(wrapper.find(CircularProgress)).toHaveLength(1);
    });
    it('should render NotFound component if visible items are empty', () => {
        const wrapper = shallow(<RoomList {...props} loading={false} rooms={[]} />);
        expect(wrapper.find(NotFound)).toHaveLength(1);
    });
    it('should render RoomCard component if visible items are not empty', () => {
        const wrapper = shallow(<RoomList {...props} />);
        expect(wrapper.find(RoomCard)).toHaveLength(1);
    });
});
