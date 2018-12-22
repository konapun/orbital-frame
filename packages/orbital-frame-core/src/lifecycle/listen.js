const listen = ({configService, listenerService}) => next => () => {
  listenerService.listen(configService.name).pipe(message => {
    // TODO: transformations on message?
    console.log('LISTEN TRIGGER NEXT')
    next(message) // trigger next lifecycle stage
  })
}

export default listen

