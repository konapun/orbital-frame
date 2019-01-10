const listen = ({configService, listenerService}) => next => () => {
  listenerService.listen(configService.name).pipe(response => {
    next(response) // TODO: transformations on response?
  })
}

export default listen

