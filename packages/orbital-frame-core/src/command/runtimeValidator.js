import Joi from '@hapi/joi'

function runtimeValidator ({ type, default: deflt, required }) {
  const schema = Joi[type]()
  if (deflt) {
    schema.default(() => deflt)
  }
  if (required) {
    schema.required()
  }

  return {
    validate (value) {
      const { error, value: val } = schema.validate(value)
      if (error) {
        throw error
      }

      return val
    }
  }
}

export default runtimeValidator
