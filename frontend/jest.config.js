const esModules = ['react-icons'].join('|');
module.exports = {
    setupFilesAfterEnv: ['./src/setupTests.js'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
        '^.+\\.(css|less|scss|jpg|jpeg|png|svg)$': 'babel-jest',
    },
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};
