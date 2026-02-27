import '@testing-library/jest-dom/extend-expect';

const SUPPRESSED_PREFIXES = [
    'Warning: Failed prop type',
    'Warning: An update to',
    'Warning: Can\'t perform a React state update',
    'Material-UI:',
    'Warning: validateDOMNesting',
    'Warning: Each child in a list',
];

const originalError = console.error;
console.error = (message, ...args) => {
    if (typeof message === 'string' && SUPPRESSED_PREFIXES.some(prefix => message.startsWith(prefix))) {
        return;
    }
    throw new Error(message);
};