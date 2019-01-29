import stream from '../stream'

// each command is a function whose first argument is awilix services
function command (definition) {
  const { reader, writer } = stream()

  return {
    pipe (command2) {

    }
  }
}

export default command
