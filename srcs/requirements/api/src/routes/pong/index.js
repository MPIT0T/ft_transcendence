'use strict'

module.exports = async function (fastify, opts) {
  const gameObjects = {
    p1: {
      id: null,
      x: 10,
      y: 250,
      width: 10,
      height: 50,
      vel_y: 0,
      score: 0
    },
    p2: {
      x: 480,
      y: 250,
      width: 10,
      height: 50,
      vel_y: 0,
      score: 0
    },
    ball: {
      x: 250,
      y: 250,
      width: 10,
      height: 10,
      vel_x: 1,
      vel_y: 2
    },
  }
  const rooms = new Map();

  const playerOutOfBound = (ypos) => {
    return (ypos < 0 || ypos > 450)
  }

  const resetGame = (state) => {
    state.p1.x = 10;
    state.p1.y = 250;
    state.p1.vel_y = 0;

    state.p2.x = 480;
    state.p2.y = 250;
    state.p2.vel_y = 0;

    state.ball.x = 250;
    state.ball.y = 250;
    state.ball.vel_y = 2;

    return state;
  }

  const detectColision = (a, b) => {
    return a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y;
  }

  const handleGame = (state) => {
    let newP1_y = state.p1.y + state.p1.vel_y;

    if (!playerOutOfBound(newP1_y))
      state.p1.y = newP1_y

    let newP2_y = state.p2.y + state.p2.vel_y;
    if (!playerOutOfBound(newP2_y))
      state.p2.y = newP2_y

    state.ball.x += state.ball.vel_x
    state.ball.y += state.ball.vel_y

    if (state.ball.y <= 0 || (state.ball.y + state.ball.height >= 500))
      state.ball.vel_y *= -1;

    // // Improved collision math for paddles
    // if (detectColision(state.ball, state.p1)) {
    //   // Ball hits left paddle: reflect and add some "spin" based on impact position
    //   state.ball.x = state.p1.x + state.p1.width; // Prevent sticking
    //   state.ball.vel_x = Math.abs(state.ball.vel_x); // Always go right
    //   // Add vertical velocity based on where the ball hits the paddle
    //   const impact = (state.ball.y + state.ball.height / 2) - (state.p1.y + state.p1.height / 2);
    //   state.ball.vel_y += impact * 0.15;
    // }
    // else if (detectColision(state.ball, state.p2)) {
    //   // Ball hits right paddle: reflect and add some "spin" based on impact position
    //   state.ball.x = state.p2.x - state.ball.width; // Prevent sticking
    //   state.ball.vel_x = -Math.abs(state.ball.vel_x); // Always go left
    //   // Add vertical velocity based on where the ball hits the paddle
    //   const impact = (state.ball.y + state.ball.height / 2) - (state.p2.y + state.p2.height / 2);
    //   state.ball.vel_y += impact * 0.15;
    // }

    if (detectColision(state.ball, state.p1)) {
      if (state.ball.x <= state.p1.x + state.p1.width)
        state.ball.vel_x *= -1;

    }
    else if (detectColision(state.ball, state.p2)) {
      if (state.ball.x + 10 >= state.p1.x)
        state.ball.vel_x *= -1;
    }

    if (state.ball.x < 0) {
      state.p2.score += 1;
      state = resetGame(state);
      state.ball.vel_x *= -1;
    }
    else if (state.ball.x + 10 > 500) {
      state.p1.score += 1;
      state = resetGame(state);
      state.ball.vel_x *= -1;
    }
    return state;
  }

  fastify.get('/', async function (request, reply) {
    return 'this is an ws'
  })

  const stopPlayer = (e) => {
    if (e == "KeyW")
      return 0;
    else if (e == "KeyS")
      return 0;

    else if (e == "ArrowUp")
      return 0;
    else if (e == "ArrowDown")
      return 0;
  }

  const movePlayer = (e) => {

    if (e == "KeyW")
      return -3;
    else if (e == "KeyS")
      return 3;
    else if (e == "ArrowUp")
      return -3;
    else if (e == "ArrowDown")
      return 3;
  }

  const connectedClients = new Set();

  const clients = new Set();
  let intervalId = null;

  fastify.get('/ws', { websocket: true }, (connection, req) => {
    connection["room"] = '00';
    if (clients.size == 0)
      connection["player"] = 1;
    else
      connection["player"] = 2;
    clients.add(connection);
    console.log('Nouvelle connexion WebSocket');

    connection.on('message', (message) => {

      try {
        const data = JSON.parse(message);
        const { header, body } = data;
        // console.log('header :', header);
        // console.log('body :', body);

        if (header === 'client-msg-' + body.room + '-StartGame') {

          rooms.set(body.room, structuredClone(gameObjects))
          // console.log(rooms.get(body.room))
          if (intervalId)
            clearInterval(intervalId);
          intervalId = setInterval(() => {
            rooms.set(body.room, handleGame(rooms.get(body.room)))
            for (const client of clients) {
              if (client.readyState === 1 && client.room === body.room) {
                client.send(JSON.stringify({
                  header: 'server-msg-' + body.room + '-gameUpdate',
                  body: rooms.get(body.room)
                }));
              }
            }
          }, 10); // send every 0.1 second

          connection.on('close', () => {
            clearInterval(intervalId);
            clients.delete(connection);
            rooms.delete(body.room);
            console.log('Client déconnecté');
          });
        }

        // if (header === 'chat') {
        //   // Broadcast à tous les clients
        //   for (const client of clients) {
        //     if (client !== connection && client.readyState === 1)
        //       client.send(`Reçu de quelqu’un : ${body}`);
        //     else
        //       client.send(`Envoie : ${body}`)
        //   }
        // }
        if (header === 'client-msg-' + body.room + '-keyEvent') {
          const state = rooms.get(body.room);
          if (state) {
            if (connection.player == 1) {
              if (body.move)
                state.p1.vel_y = movePlayer(body.key);
              else
                state.p1.vel_y = stopPlayer(body.key);
              state.player = 1

            }
            if (connection.player == 2) {
              if (body.move)
                state.p2.vel_y = movePlayer(body.key);
              else
                state.p2.vel_y = stopPlayer(body.key);
              state.player = 2
            }
            rooms.set(body.room, state);
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
  });
}
