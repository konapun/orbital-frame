const config = frame => () => ({
  name: frame.name,
  commands: frame.commands,
  plugins: frame.plugins,
  adapter: frame.adapter
  // TODO:
})

export default config
