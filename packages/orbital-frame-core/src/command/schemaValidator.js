import Joi from '@hapi/joi'
import defaultFormatter from './defaultFormatter'

export const optionType = {
  NUMBER: 'number',
  STRING: 'string',
  BOOLEAN: 'boolean'
}

export const schema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().default(''),
  synopsis: Joi.string().default(''),
  usage: Joi.string().default(''),
  options: Joi.object().pattern(/^[a-zA-Z0-9]$/, Joi.object().keys({
    alias: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().valid(...Object.values(optionType)).required(),
    required: Joi.boolean().default(false),
    default: Joi.ref('options.type'), // default value must be of the same type as the option type
    valid: Joi.func().default(() => () => true)
  })).default({}),
  format: Joi.func().default(() => defaultFormatter),
  execute: Joi.func().required()
})

export default {
  validate (command) {
    return schema.validate(command)
  }
}
