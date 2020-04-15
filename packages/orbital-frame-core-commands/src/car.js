export default () => ({
  name: 'car',
  synopsis: 'car [ITEM] ...[ITEMS]',
  description: 'Treat input as a const cell and get the first contents',
  execute: ([ car ]) => car
})
