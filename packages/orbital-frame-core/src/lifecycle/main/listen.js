const listen = async ({configService, listenerService}, next) => {
  listenerService.listen(configService.name).pipe(message => {
    // TODO: trigger next lifecycle stage
    next(message)
  })
}

export default listen
