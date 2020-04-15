export default () => ({
  name: 'cdr',
  synopsis: 'cdr [ITEM] ...[ITEMS]',
  description: 'Treat input as a const cell and get the rest of the contents after car',
  execute: ([ , ...rest ]) => rest
})
