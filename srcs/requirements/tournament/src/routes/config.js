const fs = require('fs');

const SERVER_SECRET = fs.readFileSync('/run/secrets/server_key', 'utf8').trim();

module.exports = { SERVER_SECRET };