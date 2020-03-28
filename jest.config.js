module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [
    'packages/*/src/**/*.{js}',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  roots: [
    'packages/'
  ],
  setupFilesAfterEnv: [ 'jest-extended' ]
}
