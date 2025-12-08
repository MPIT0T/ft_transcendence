const {getUserbyId, sqliteCurrentTimestamp} = require("../utils.js");
const db = require('../db.js');

module.exports = async function (fastify, opts) {

    fastify.log.info("🔁 Check online users plugin initialized")

    setInterval(async () => {
        try {
            await checkUsersOnline(fastify, opts);

            fastify.log.info("✔️ Users online check executed")
        } catch (err) {
            fastify.log.error("❌ Error checking users online:", err)
        }
    }, 5000)
}

async function checkUsersOnline(fastify, opts) {
    fastify.log.info("Checking users…")

    const users = db.prepare("SELECT id, last_ping FROM users").all();
    const now = Date.now();

    const updateStmt = db.prepare("UPDATE users SET online = ? WHERE id = ?");

    for (const user of users) {
        const msDiff = now - new Date(user.last_ping).getTime();
        updateStmt.run(msDiff < 30000 ? 1 : 0, user.id);
    }
}
