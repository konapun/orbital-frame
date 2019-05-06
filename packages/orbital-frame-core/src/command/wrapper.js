export default definition => ({
  ...definition,
  execute (args, opts = {}) {
    return definition.execute.call(this, [].concat(args), opts)
  }
})
