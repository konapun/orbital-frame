export default () => ({
  name: 'no-format',
  synopsis: 'no-format [ARGUMENT] ...[ARGUMENTS]',
  description: 'Get the raw output of a command without running it through its formatter',
  execute: args => args
})
