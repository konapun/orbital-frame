export default () => ({
  name: 'or',
  execute: ([ branch1, branch2 ]) => branch1 || branch2
})
