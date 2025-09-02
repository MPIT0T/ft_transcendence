// Example of correct Fastify app structure
module.exports = async function (fastify, opts) {
  // Your routes here
}

// or if using options:
const options = {}
// Then use options variable


// 'use strict'

// const path = require('node:path');
// const AutoLoad = require('@fastify/autoload');

// module.exports = async function (fastify, opts) {
//     fastify.register(AutoLoad, {
//         dir: path.join(__dirname, 'plugins'),
//         options: Object.assign({}, opts)
//     });

//     fastify.register(AutoLoad, {
//         dir: path.join(__dirname, 'routes'),
//         options: Object.assign({}, opts)
//     });
// };

// module.exports.options = options