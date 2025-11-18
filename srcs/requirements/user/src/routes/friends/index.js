'use strict';
const db = require("../../db.js");

function getUserFromId(friendsIds)
{
    if (typeof friendsIds !== 'string') {
        return [];
    }
    const allFriendsNames = [];
    const allFriendsIds = friendsIds.split(',');
    const stmt = db.prepare('SELECT username FROM users WHERE id = ?');

    for (const id of allFriendsIds)
        allFriendsNames.push(stmt.get(id));
    return allFriendsNames;
}

module.exports = getUserFromId;
