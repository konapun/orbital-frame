const jehuty = require('../dist').default

function bootstrap (hubot) {
  jehuty(hubot).run({option1: 'test'})
}

module.exports = bootstrap
