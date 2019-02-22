const config = frame => () => ({
  name: frame.name,
  commands: frame.commands,
  plugins: frame.plugins,
  adapter: frame.adapter
})

export default config
