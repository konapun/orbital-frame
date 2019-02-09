const jehuty = require('../dist').default

function bootstrap (hubot) {
  jehuty(hubot).run()
}

module.exports = bootstrap
