const esModules = ['react-icons'].join('|');
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./src/setupTests.js'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
        '^.+\\.(css|less|scss|jpg|jpeg|png|svg)$': 'babel-jest',
        '^jspdf$': '<rootDir>/src/__mocks__/jspdf.js',
        '^jspdf-autotable$': '<rootDir>/src/__mocks__/jspdf-autotable.js',
    },
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
    resetMocks: true,
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
};
