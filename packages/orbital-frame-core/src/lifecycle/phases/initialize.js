const initialize = services => next => async args => {
  await Promise.all(Object.values(services)) // some services have async initialization
  next(args)
}

export default initialize
