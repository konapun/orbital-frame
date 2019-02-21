import Joi from 'joi'

export const optionType = {
  NUMBER: 'number',
  STRING: 'string',
  BOOLEAN: 'boolean'
}

export const schema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  usage: Joi.string().default(''),
  options: Joi.object().pattern(/^[a-zA-Z]$/, Joi.object().keys({
    alias: Joi.string().required(),
    describe: Joi.string().required(),
    type: Joi.string().valid(Object.values(optionType)).required(),
    required: Joi.boolean().default(false),
    default: Joi.any() // TODO should make sure this is the same type as defined above
  })).default({}), // FIXME: it doesn't look like the default value is taking
  format: Joi.func().default(() => {}),
  execute: Joi.func().required()
})

export default {
  validate (command) {
    return Joi.validate(command, schema)
  }
}
