import '@testing-library/jest-dom/extend-expect';

console.error = (message) => {
    throw new Error(message);
};