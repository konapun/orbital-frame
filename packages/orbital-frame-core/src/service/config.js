const config = frame => () => ({
  name: frame.name,
  ps1: frame.ps1,
  ps2: frame.ps2,
  commands: frame.commands,
  plugins: frame.plugins,
  adapter: frame.adapter
})

export default config
