import { getGroupsOptionsForSelect } from './selectUtils';

const array = [
    { id: 116, disable: false, title: '100' },
    { id: 27, disable: false, title: '102-А' },
];
const expectedArray = [
    { id: 116, value: 116, label: '100' },
    { id: 27, value: 27, label: '102-А' },
];

describe('getGroupsOptionsForSelect function', () => {
    it('should return correct format obj array', () => {
        expect(getGroupsOptionsForSelect(array)).toEqual(expectedArray);
    });
});
