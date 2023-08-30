/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['./testSetup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
}
