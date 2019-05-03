export default definition => ({
  ...definition,
  execute (args, opts = {}) {
    return definition.execute([].concat(args), opts)
  }
})
