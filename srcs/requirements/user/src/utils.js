'use strict'
const db = require("./db.js");
const jwt = require("jsonwebtoken");
const fs = require( 'fs');
const JWT_SECRET = fs.readFileSync('/run/secrets/jwt_key', 'utf8').trim();

function getUserbyUsername(username) {
    const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
    let user = null;

    user = stmt.get(username);
    return user;
}

function sqliteCurrentTimestamp() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function getUserbyId(id) {
    const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
    let user = null;

    user = stmt.get(id);
    return user;
}

function checkToken(token, username){
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.username == username)
            return true;
        else return false;
    } catch (err) {
        return false;
    }
}

module.exports = {
    getUserbyUsername,
    getUserbyId,
    sqliteCurrentTimestamp,
    checkToken,
    JWT_SECRET
}