'use strict';

const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const privateKey = "secret123123";
const GITHUB_CLIENT_ID = 'Ov23libyRMWHw34E2bL0';
const GITHUB_CLIENT_SECRET = '6bda1291461c3ecbe7a9c970481fbf7369ae7e56';
const {getUserbyUsername} = require('../../utils.js');

const db = require('../../db.js');

const addCorsHeaders = (reply) => {
  return reply
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .header('Access-Control-Allow-Credentials', 'true');
};

function githubRegister(username, avatar, gitUrl) {
  try {
    const stmt = db.prepare(`
      INSERT INTO users (username, password, git_acc, avatar)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(username, 'gitacc', gitUrl, avatar);
    if (!info.changes) throw new Error('Insert failed');
    return username;
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed: users.username')) {
      const user = getUserbyUsername(username);
      if (user && user.git_acc === gitUrl) {
        return user.username;
      } else {
        return null;
      }
    }
    throw err;
  }
}

async function githubAuthRoute(fastify, options) {
  fastify.options('/', async (request, reply) => {
    addCorsHeaders(reply);
    return reply.status(204).send();
  });

  fastify.options('/callback', async (request, reply) => {
    addCorsHeaders(reply);
    return reply.status(204).send();
  });

  fastify.get('/', async (request, reply) => {
    return reply.ok({message: request.body.message});
  });

  fastify.post('/', async (request, reply) => {
    addCorsHeaders(reply);

    const { code } = request.body;

    if (!code) {
      return reply.status(400).send({ error: 'Code manquant' });
    }

    try {
      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code
        })
      });

      const { access_token } = await tokenResponse.json();

      const userResponse = await fetch("https://api.github.com/user", {
        headers: { Authorization: `token ${access_token}` }
      });

      const user = await userResponse.json();
      if (!user)
        return reply.status(400).send({ error: 'User not found' });
      let find_username = null;
      let count = 0;
      while (!find_username)
      {
        if (count)
          find_username =  await githubRegister(user.login + count, user.avatar_url, user.url);
        else
          find_username =  await githubRegister(user.login, user.avatar_url, user.url);
        count++;
      }
      const finalUser = getUserbyUsername(find_username);
      const token = jwt.sign(
          { username: find_username , avatar: finalUser.avatar },
          privateKey,
          { expiresIn: '1h' }
      );

      return reply.send({
        success: true,
        message:  'Connection effectué avec succès !' + find_username,
        token
      });
    } catch (error) {
      return reply.status(500).send({ error: 'Erreur serveur lors de l\'authentification GitHub' });
    }
  });
}

module.exports = githubAuthRoute;