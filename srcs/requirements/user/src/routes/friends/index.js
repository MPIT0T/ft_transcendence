'use strict';
const db = require("../../db.js");

function getFriendsFromId(friendsIds)
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

function getStatusFromId(friendsIds)
{
    if (typeof friendsIds !== 'string') {
        return [];
    }
    const allFriendsStatus = [];
    const allFriendsIds = friendsIds.split(',');
    const stmt = db.prepare('SELECT online FROM users WHERE id = ?');

    for (const id of allFriendsIds)
        allFriendsStatus.push(stmt.get(id));
    return allFriendsStatus;
}

module.exports =
    {
        getFriendsFromId,
        getStatusFromId,
    };
