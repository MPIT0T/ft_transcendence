'use strict'
const sqlite3 = require('better-sqlite3');

const db = sqlite3('user.db');

db.exec(`
CREATE TABLE IF NOT EXISTS users
(

    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    username        TEXT UNIQUE NOT NULL,
    password        TEXT NOT NULL,
    created_at      DATE DEFAULT CURRENT_DATE,
    elo             INTEGER DEFAULT 0,
    token           TEXT UNIQUE,
    avatar          TEXT DEFAULT 'alien.png',
    friends_id      TEXT DEFAULT '[]',
    invites_id      TEXT DEFAULT '[]',
    git_acc         TEXT DEFAULT NULL,
    last_ping       DATETIME DEFAULT CURRENT_DATE
)
`)
module.exports = db;