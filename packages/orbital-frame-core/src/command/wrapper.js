export default definition => ({
  ...definition,
  execute (args, opts = {}, metadata = {}) {
    return definition.execute.call(this, [].concat(args), opts, metadata)
  }
})
