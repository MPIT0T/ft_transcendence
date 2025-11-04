'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const privateKey = require('../register/index.js').privateKey;
const GITHUB_CLIENT_ID = 'Ov23libyRMWHw34E2bL0'; // ← Remplacez
const GITHUB_CLIENT_SECRET = ' 6bda1291461c3ecbe7a9c970481fbf7369ae7e56'; // ← Remplacez
const REDIRECT_URI = 'http://localhost:https://127.0.0.1:4430/github/callback'; // ← Adaptez

// Simule une "base de données" en mémoire (pour standalone)
const usersDb = new Map(); // githubId → { username, avatar, githubId }

const addCorsHeaders = (reply) => {
  return reply
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .header('Access-Control-Allow-Credentials', 'true');
};

async function githubAuthRoute(fastify, options) {
  // Préflight CORS
  fastify.options('/github', async (request, reply) => {
    addCorsHeaders(reply);
    return reply.status(204).send();
  });

  fastify.options('/github/callback', async (request, reply) => {
    addCorsHeaders(reply);
    return reply.status(204).send();
  });

  // Étape 1 : Redirection vers GitHub
  fastify.get('/github', async (request, reply) => {
    addCorsHeaders(reply);

    const state = crypto.randomBytes(16).toString('hex');
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=user:email&state=${state}`;

    request.session = request.session || {};
    request.session.githubOAuthState = state;

    return reply.redirect(githubAuthUrl);
  });

  fastify.get('/auth/github/callback', async (request, reply) => {
    addCorsHeaders(reply);

    const { code, state } = request.query;

    if (!code || !state) {
      return reply.status(400).send({ error: 'Code ou state manquant' });
    }

    if (request.session?.githubOAuthState !== state) {
      return reply.status(400).send({ error: 'State invalide' });
    }

    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (tokenData.error) {
        return reply.status(400).send({ error: 'Échec de l\'échange de token', details: tokenData });
      }

      const accessToken = tokenData.access_token;
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'fastify-github-oauth',
        },
      });

      const githubUser = await userResponse.json();

      if (!githubUser.login || !githubUser.id) {
        return reply.status(500).send({ error: 'Impossible de récupérer les données GitHub' });
      }

      const githubId = githubUser.id.toString();
      const username = githubUser.login;
      const avatar = githubUser.avatar_url || 'alien.png';

      let user = usersDb.get(githubId);

      if (!user) {
        user = { username, avatar, githubId };
        console.log(`Nouvel utilisateur GitHub créé: ${username}`);
      } else {
        console.log(`Connexion de l'utilisateur existant: ${username}`);
      }

      const payload = {
        username: user.username,
        avatar: user.avatar,
        githubId: user.githubId,
      };

      const token = jwt.sign(payload, privateKey, { expiresIn: '1h' });

    return reply.send({
        success: true,
        message: 'Connexion GitHub réussie',
        token: token,
    });

    } catch (error) {
      console.error('Erreur OAuth GitHub:', error);
      return reply.status(500).send({ error: 'Erreur serveur lors de l\'authentification GitHub' });
    }
  });
}

module.exports = { githubAuthRoute };