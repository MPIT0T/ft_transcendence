// 'use strict'

// const fastify = require('fastify');

// module.exports = async function(fastify, opts) {
//     fastify.get('/', async (req, rep) => {
//         return {msg: "Hello World from Fastify"};
//     });
// };


'use strict'

const path = require('node:path')
const AutoLoad = require('@fastify/autoload')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// Pass --options via CLI arguments in command to enable these options.
const options = {}

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}

module.exports.options = options
