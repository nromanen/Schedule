import React from 'react';
import { render, screen } from '@testing-library/react';
import { getHref } from './getHref';

describe('getHref function', () => {
    it('should return link with href', () => {
        const link = 'https://www.youtube.com/';
        render(getHref(link));
        const anchor = screen.getByTitle(link);
        expect(anchor).toBeInTheDocument();
        expect(anchor).toHaveAttribute('href', link);
    });
});