const config = frame => () => ({
  name: frame.name,
  ps2: frame.ps2,
  commands: frame.commands,
  plugins: frame.plugins,
  adapter: frame.adapter
})

export default config
