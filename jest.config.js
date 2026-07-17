/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./tests/setupTests.js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { diagnostics: false }],
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/fileTransformer.js',
  },
  moduleNameMapper: {
    '\\.(css|scss|less)$': '<rootDir>/tests/styleMock.js',
    '@babel/polyfill/lib/noConflict': '<rootDir>/tests/styleMock.js',
  },
};
