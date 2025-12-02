'use strict';

const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
//process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = "646709615614-o4v2kdnbn5mhjkncnme6mdqhbd0j3lt5.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const { getUserbyUsername, JWT_SECRET } = require('../../utils.js');
const db = require('../../db.js');

const addCorsHeaders = (reply) => {
  return reply
      .header('Access-Control-Allow-Origin', '*')
      .header('Access-Control-Allow-Methods', 'GET, OPTIONS')
      .header('Access-Control-Allow-Headers', 'Content-Type')
      .header('Access-Control-Allow-Credentials', 'true');
};

function googleRegister(username, avatar, googleId) {
  try {
    const stmt = db.prepare(`
      INSERT INTO users (username, password, git_acc, avatar)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(username, 'google_oauth', googleId, avatar);
    if (!info.changes) throw new Error('Insert failed');
    return username;
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed: users.username')) {
      const user = getUserbyUsername(username);
      if (user && user.git_acc === googleId) return user.username;
      return null;
    }
    throw err;
  }
}

async function googleAuthRoute(fastify, options) {

  fastify.options('/', async (request, reply) => {
    addCorsHeaders(reply);
    return reply.status(204).send();
  });

  fastify.options('/callback', async (request, reply) => {
    addCorsHeaders(reply);
    return reply.status(204).send();
  });

  fastify.post('/', async (request, reply) => {
    addCorsHeaders(reply);

    const { code } = request.body;

    if (!code) {
      return reply.status(400).send({ error: 'Code manquant' });
    }

    try {
      const params = new URLSearchParams();
      params.append("client_id", GOOGLE_CLIENT_ID);
      params.append("client_secret", GOOGLE_CLIENT_SECRET);
      params.append("code", code);
      params.append("grant_type", "authorization_code");
      params.append("redirect_uri", "https://127.0.0.1:4430/oauth-callback.html");

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });

      const tokenData = await tokenResponse.json();
      const access_token = tokenData.access_token;

      if (!access_token)
        return reply.status(400).send({ error: "Impossible d'obtenir l'access_token Google" });
      const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` }
      });

      const user = await userResponse.json();
      if (!user || !user.sub)
        return reply.status(400).send({ error: "Utilisateur Google introuvable" });
      const baseUsername = user.name?.replace(/\s+/g, '') || "googleUser";
      let find_username = null;
      let count = 0;

      while (!find_username) {
        const candidate = count ? `${baseUsername}${count}` : baseUsername;
        find_username = googleRegister(candidate, user.picture, user.sub);
        count++;
      }

      const finalUser = getUserbyUsername(find_username);

      const token = jwt.sign(
          { username: find_username, avatar: finalUser.avatar, elo: finalUser.elo },
          JWT_SECRET,
          { expiresIn: '7d' }
      );

      return reply.send({
        success: true,
        message: `Connexion Google réussie : ${find_username}`,
        token
      });

    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Erreur serveur lors de l'authentification Google" });
    }
  });
}

module.exports = googleAuthRoute;
