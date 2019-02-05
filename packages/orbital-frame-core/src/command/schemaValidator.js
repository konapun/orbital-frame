import Joi from 'joi'

const schema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  usage: Joi.string().default(''),
  options: Joi.object().default({}),
  format: Joi.func().default(() => {}),
  execute: Joi.func().required()
})

export default {
  validate (command) {
    return Joi.validate(command, schema)
  }
}

export { schema }
