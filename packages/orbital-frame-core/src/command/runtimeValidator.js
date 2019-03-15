import Joi from 'joi'

function runtimeValidator ({ type, default: deflt, required }) {
  const validator = Joi[type]()
  if (deflt) {
    validator.default(deflt)
  }
  if (required) {
    validator.required()
  }

  return {
    validate (value) {
      const { error, value: val } = validator.validate(value)
      if (error) {
        throw error
      }

      return val
    }
  }
}

export default runtimeValidator
