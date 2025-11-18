'use strict';
const db = require("../../db.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "secret123123";


const addCorsHeaders = (reply) => {
  reply
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .header('Access-Control-Allow-Credentials', 'true');
  return reply;
};

function insertUser(username, hashedPassword) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      const info = stmt.run(username, hashedPassword);
        if (!info.changes) {
          return reject(new Error('Insert failed'));
        }
        resolve(info);
    } catch (err) {
      reject(err);
    }
  });
}

async function registerRoute(fastify, options) {
  fastify.addHook('preHandler', (req, reply, done) => {
    addCorsHeaders(reply);
    if (req.method === 'OPTIONS') {
      reply.status(204).send();
      return;
    }
    done();
  });

  fastify.options('/', async (req, reply) => {
    return reply.status(204).send();
  });

  fastify.post('/', async (req, reply) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return reply.status(400).send({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    if (!regex.test(password))
      return reply.status(400).send({ error: 'Le mot de passe doit faire entre 6 et 18 charateres et avoir au moins 1 majuscule et 1 chiffre'});
    try {
      const hashedPassword = await bcrypt.hash(password, 10);


      const result = await insertUser(username, hashedPassword);
      const token = jwt.sign(
        { username, avatar: 'alien.png' },
        PRIVATE_KEY,
        { expiresIn: '1h' }
      );

      return reply.send({
        success: true,
        message: 'Compte créé avec succès !',
        token
      });

    } catch (err) {
        if (err.toString() == "SqliteError: UNIQUE constraint failed: users.username")
        return reply.status(401).send({ error: "Nom d'utilisateur deja utilise" });
      console.error('Erreur:', err);
      return reply.status(500).send({ error: ('Erreur serveur ' + err.toString())});
    }
  });
}

module.exports = registerRoute;