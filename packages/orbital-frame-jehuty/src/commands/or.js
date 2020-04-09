export default () => ({
  name: 'or',
  synopsis: 'or [CONDITION1] [CONDITION2]',
  description: 'Evaluate the OR of two conditions to a boolean',
  execute: ([ condition1, condition2 ]) => condition1 || condition2
})
