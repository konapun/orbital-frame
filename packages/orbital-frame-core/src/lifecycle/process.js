const process = ({ parserService }) => next => response => {
  const message = response.message.text.split(/\s+/).splice(1).join(' ')
  console.log('Transformed message to', message)
  next(message)
}

export default process
