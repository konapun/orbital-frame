const listen = async ({configService, listenerService}, next) => {
  listenerService.listen(configService.name).pipe(message => {
    // TODO: transformations on message?
    next(message) // trigger next lifecycle stage
  })
}

export default listen
