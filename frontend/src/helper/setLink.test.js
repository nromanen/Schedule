import { setLink } from './setLInk';

test('test link', () => {
    const data = 'test@gmail.com';
    expect(setLink(data, 123)).toEqual('http://test@gmail.com');
});
