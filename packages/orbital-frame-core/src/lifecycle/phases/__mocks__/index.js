export const loadPlugins = jest.fn((services, next) => {
  next('loadPlugins')
})

export const loadCommands = jest.fn((services, next, args) => {
  next(`${args} loadCommands`)
})

export const listen = jest.fn((services, next, args) => {
  next(`${args} listen`)
})

export default {
  loadPlugins: {
    call: services => next => args => loadPlugins(services, next, args)
  },
  loadCommands: {
    call: services => next => args => loadCommands(services, next, args)
  },
  listen: {
    call: services => next => args => listen(services, next, args)
  }
}
