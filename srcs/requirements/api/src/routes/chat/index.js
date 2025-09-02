module.exports = async function (fastify, opts) {
  // Store active WebSocket connections
  const clients = new Set();

  fastify.get('/', async function (request, reply) {
    return 'this a chat'
  })

  fastify.get('/chat', { websocket: true }, (connection, req) => {

    clients.add(connection);
    console.log('Nouvelle connexion ChatSocket');

    connection.on('message', (message) => {

      try {
        const data = JSON.parse(message);
        const { header, body } = data;

        if (header === 'chat') {
          for (const client of clients) {
            if (client !== connection && client.readyState === 1)
              client.send(`Reçu de quelqu’un : ${body}`);
            else
              client.send(`Envoie : ${body}`)
          }
        }
      }
      catch (e) {
        console.error('Message invalide', e);
      }
    });

    connection.on('close', () => {
      clients.delete(connection);
      console.log('Client déconnecté');
    });
  })
}