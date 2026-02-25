import React from 'react';
import { render } from '@testing-library/react';
import { setLink } from './setLInk';
import { places } from '../constants/places';

const card = { link: 'https://www.google.com/' };

describe('setLink function', () => {
    it('should return LinkToMeeting component if places.TOGETHER', () => {
        const result = setLink(card, places.TOGETHER);
        const { container } = render(result);
        expect(container.innerHTML).not.toBe('');
    });

    it('should return link with href if places.ONLINE', () => {
        const result = setLink(card, places.ONLINE);
        const { container } = render(<>{result}</>);
        expect(container.innerHTML).not.toBe('');
    });

    it('should return null if places = null', () => {
        expect(setLink(card)).toBeNull();
    });
});
