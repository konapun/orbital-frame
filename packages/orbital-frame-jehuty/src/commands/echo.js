export default () => ({
  name: 'echo',
  description: 'Write arguments to standard output',
  format: output => output.join(' '),
  execute: args => args
})
