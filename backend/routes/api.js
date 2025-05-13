module.exports = async function (fastify, opts) {
    fastify.get('/api/ping', async (request, reply) => {
      return { msg: 'pong' };
    });
  
    fastify.get('/api/users', async (request, reply) => {
      const [rows] = await fastify.mysql.query('SELECT * FROM users');
      return rows;
    });
  };
  