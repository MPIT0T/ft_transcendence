'use strict';
const db = require("../../../db.js");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../../../utils.js");
const {errorToken} = require("../../../utils");
const bcrypt = require('bcrypt');

async function apiChangeUsernameRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        //change username in db
        const { username, password, newPassword} = req.body || {};
        if (!username || !password || !newPassword) {
            return reply.status(400).send({ error: "missing credentials" });
        }
        const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;
        if (!regex.test(newPassword) || !regex.test(password))
            return reply.status(400).send({ error: 'Le mot de passe doit faire entre 6 et 18 charateres et avoir au moins 1 majuscule et 1 chiffre'});
        if (errorToken(req.headers['authorization'], username))
        {
            return reply.status(401).send({error: "Token manquant ou invalide"});
        }
        try {
            const prepUserInfo = db.prepare('SELECT * from users where username = ?');
            const allUserInfo = prepUserInfo.get(username);
            const stmt = db.prepare('UPDATE users SET password = ? WHERE username = ?');
            const res = await bcrypt.compare(password, allUserInfo.password);
            if (res)
            {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                stmt.run(hashedPassword, username);
                reply.status(200).send({ message: "password modifie avec succes", token});
            }
        }
        catch (err) {
            return reply.status(400).send({ error: err.message });
        }
    });
}

module.exports = apiChangeUsernameRoute;