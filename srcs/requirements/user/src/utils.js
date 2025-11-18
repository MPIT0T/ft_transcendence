'use strict'
const db = require("./db.js");

function getUserbyUsername(username) {
    const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
    let user = null;

    user = stmt.get(username);
    return user;
}

module.exports = {
    getUserbyUsername
}