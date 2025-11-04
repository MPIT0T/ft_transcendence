'use strict';
const db = require("../../db.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PRIVATE_KEY = process.env.USER_SECRET_PASS;

const addCorsHeaders = (reply) => {
  reply
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .header('Access-Control-Allow-Credentials', 'true');
  return reply;
};

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

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await new Promise((resolve, reject) => {
        if (!db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword))
          if (err) return reject(err);
      });
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
      console.error('Erreur:', err);
      return reply.status(500).send({ error: ('Erreur serveur ' + err.toString())});
    }
  });
}

module.exports = registerRoute;