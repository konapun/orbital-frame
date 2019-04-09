// TODO: https://codeburst.io/monorepos-by-example-part-2-4153712cfa31
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
  setupTestFrameworkScriptFile: 'jest-extended'
}
