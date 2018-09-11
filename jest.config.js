// TODO: https://codeburst.io/monorepos-by-example-part-2-4153712cfa31
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/*.{js}',
    '!**/node_modules/**',
  ],
  roots: [
    'packages/',
  ],
}
