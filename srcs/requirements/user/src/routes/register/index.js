'use strict';
const db = require("../../db.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// CLE FIXE (ou .env)
const PRIVATE_KEY = 'super_secret_jwt_key_1234567890_abcde';

// Fonction utilitaire pour les headers CORS
const addCorsHeaders = (reply) => {
  reply
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .header('Access-Control-Allow-Credentials', 'true');
  return reply;
};

async function registerRoute(fastify, options) {
  // === CORS GLOBAL DANS LA ROUTE (OU MIEUX : dans server.js) ===
  fastify.addHook('preHandler', (req, reply, done) => {
    addCorsHeaders(reply);
    if (req.method === 'OPTIONS') {
      reply.status(204).send();
      return;
    }
    done();
  });

  // === OPTIONS (redondant mais sûr) ===
  fastify.options('/register', async (req, reply) => {
    return reply.status(204).send();
  });

  // === POST /register ===
  fastify.post('/register', async (req, reply) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return reply.status(400).send({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    try {
      // Vérifie si l'utilisateur existe (Promise pour async/await)
      const existingUser = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
          if (err) return reject(err);
          resolve(row);
        });
      });

      if (existingUser) {
        return reply.status(401).send({ error: 'Ce nom d\'utilisateur est déjà pris' });
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertion
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (username, password) VALUES (?, ?)',
          [username, hashedPassword],
          function (err) {
            if (err) return reject(err);
            resolve(this);
          }
        );
      });

      // Token
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
      return reply.status(500).send({ error: 'Erreur serveur' });
    }
  });
}

module.exports = registerRoute;
module.exports = PRIVATE_KEY;