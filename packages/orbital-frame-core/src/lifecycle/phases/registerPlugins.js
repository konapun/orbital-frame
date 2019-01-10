const registerPlugins = ({configService}) => next => () => {
  console.log('REGISTERING PLUGINS - TODO') // use config service to locate plugins?
  next()
}

export default registerPlugins
