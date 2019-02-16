import Joi from 'joi'
// checks the format of the command being invoked against the command schema

function runtimeValidator (commands) {
  const validators = commands
    // .map(command => ) // TODO: build Joi validator for specific command
    .reduce((map, command) => ({ ...map, [command.name]: command }))

  return {
    validate (command) {

    }
  }
}

export default runtimeValidator
