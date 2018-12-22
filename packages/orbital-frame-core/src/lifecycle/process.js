const process = (/* TODO: parser service */) => next => res => {
  console.log('PROCESSING MESSAGE - TODO', res.message.text)
  next('command')
}

export default process
