export default () => ({
  name: 'echo',
  synopsis: 'echo [ARGUMENT] ...[ARGUMENTS]',
  description: 'Write arguments to output',
  format: output => output.join(' '),
  execute: args => args
})
