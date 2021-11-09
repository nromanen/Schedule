import { HTTP } from '../constants/formats';

export const trasformLink = (link) => {
    const trimmedLink = link.trim();

    if (!trimmedLink.length) return '';

    return !trimmedLink.includes(HTTP) ? `http://${trimmedLink}` : trimmedLink;
};
