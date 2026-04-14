import {trasformLink} from './transformLink';

describe('trasformLink function', () => {
    it('should add https for url', () => {
        const urlWithoutHttp = 'youtube.com';

        expect(trasformLink(urlWithoutHttp)).toBe(`https://${urlWithoutHttp}`);
    });

    it('should return same https link', () => {
        const urlHttps = 'https://google.com';

        expect(trasformLink(urlHttps)).toBe(urlHttps);
    });

    it('should return same http link', () => {
        const urlHttp = 'http://facebook.com';

        expect(trasformLink(urlHttp)).toBe(urlHttp);
    });
});
