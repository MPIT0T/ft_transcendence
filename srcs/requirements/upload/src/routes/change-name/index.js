'use strict';
const fs = require('fs');
const path = require('path');
const SERVER_SECRET = fs.readFileSync('/run/secrets/server_key', 'utf8').trim();

async function uploadChangeUsernameRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        const { username, oldUsername, secret} = req.body || {};
        if (!username || !oldUsername)
            return reply.status(400).send({ error: "missing credentials" });
        if (!secret || secret !== SERVER_SECRET)
            return reply.status(401).send({ error: "server side api only" });
        const res = await fetch('https://user_handling:3003/api/check-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers['authorization'] || ""
            },
            body: JSON.stringify({ username }),
        });
        if (!res.ok)
            return reply.status(401).send({ error: "Invalid or missing token" });
        const folderPath = path.join(__dirname, 'avatars');
        if (!fs.existsSync(folderPath))
            return reply.status(200).send({ message: "avatar name changed successfully" });
        const files = await fs.promises.readdir(folderPath);
        for (const file of files) {
            const parsed = path.parse(file);
            if (parsed.name === oldUsername) {
                const oldFilePath = path.join(folderPath, file);
                const newFilePath = path.join(folderPath, `${username}${parsed.ext}`);
                if (fs.existsSync(oldFilePath))
                    await fs.promises.rename(oldFilePath, newFilePath);
            }
        }
        return reply.status(200).send({message: "avatar name changed successfully"});
    });
}

module.exports = uploadChangeUsernameRoute;