'use strict';
const db = require("../../db.js");

function getUserFromId(friendsIds)
{
    const allFriendsIds = friendsIds.split(',');
    const allFriendsNames = [];
    const stmt = db.prepare('SELECT username FROM users WHERE id = ?');

    for (const id of allFriendsIds)
        allFriendsNames.push(stmt.get(id));
    return allFriendsNames;
}

module.exports = getUserFromId;
