module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '\/test\/.+(spec|test).ts$',
  modulePathIgnorePatterns: [
    "<rootDir>/src/",
  ]
}