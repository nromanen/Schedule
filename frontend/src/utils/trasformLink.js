import { HTTP } from '../constants/common';

export const trasformLink = (link) => {
    if (!link) return link;
    const trimmedLink = link.trim();

    if (!trimmedLink.length) return '';

    return !trimmedLink.includes(HTTP) ? `http://${trimmedLink}` : trimmedLink;
};
