import Joi from 'joi'

const schema = Joi.object().keys({
  id: Joi.number().required(),
  user: Joi.number().required(),
  command: Joi.number().required(),
  started: Joi.date().required(),
  status: Joi.string().valid([ 'RUNNING', 'RESOLVED', 'REJECTED' ]),
  finished: Joi.date(),
  context: Joi.object().required()
})
