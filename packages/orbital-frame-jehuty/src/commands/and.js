export default () => ({
  name: 'and',
  synopsis: 'and [CONDITION1] [CONDITION2]',
  description: 'Evaluate the AND of two conditions to a boolean',
  execute: ([ condition1, condition2 ]) => condition1 && condition2
})
