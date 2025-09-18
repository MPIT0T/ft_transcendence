'use strict'


module.exports = async function (fastify, opts) {
    // Route WebSocket pour le jeu Pong

    await fastify.register(require('@fastify/websocket'));
    
    
    fastify.register(async function (fastify) {
        // Vérifier si fastify.authenticate existe avant de l'utiliser
        if (typeof fastify.authenticate === 'function') {
            fastify.addHook('preHandler', fastify.authenticate);
        } else {
            console.log('⚠️ Authentication middleware not available, continuing without auth');
        }
        
        fastify.get('/ws', { websocket: true }, (socket, request) => {
            console.log('🎮 New WebSocket socket for Pong');
            
            // Log des informations de connexion
            console.log('Client IP:', request.ip);
            console.log('Headers:', request.headers);
            
            // Générer un ID client unique
            const clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Envoyer l'ID au client
            socket.send(JSON.stringify({
                method: 'connect',
                clientId: clientId,
                timestamp: new Date().toISOString()
            }));
            
            // Gérer les messages du client
            socket.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    console.log('📨 Received from client:', clientId, data);
                    
                    // Traiter les différents types de messages
                    switch (data.method) {
                        case 'ping':
                            handlePing(socket, data);
                            break;
                        case 'join_game':
                            handleJoinGame(socket, data);
                            break;
                        case 'create_room':
                            handleCreateRoom(socket, data);
                            break;
                        case 'game_move':
                            handleGameMove(socket, data);
                            break;
                        default:
                            console.log('❓ Unknown message method:', data.method);
                            socket.send(JSON.stringify({
                                method: 'error',
                                message: 'Unknown method: ' + data.method
                            }));
                    }
                } catch (error) {
                    console.error('❌ Error parsing WebSocket message:', error);
                    socket.send(JSON.stringify({
                        method: 'error',
                        message: 'Invalid JSON format'
                    }));
                }
            });
            
            // Gérer les erreurs de connexion
            socket.on('error', (error) => {
                console.error('❌ WebSocket error for client', clientId, error);
            });
            
            // Gérer la déconnexion
            socket.on('close', (code, reason) => {
                console.log('👋 Client disconnected:', clientId, 'Code:', code, 'Reason:', reason?.toString());
            });
        });
    });
    
    // Route de santé pour vérifier si le serveur fonctionne
    fastify.get('/health', async (request, reply) => {
        return { 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            service: 'pong-api',
            websocket: 'available'
        };
    });

    // Route pour tester la connectivité
    fastify.get('/test', async (request, reply) => {
        return { 
            message: 'Pong API is working!',
            timestamp: new Date().toISOString()
        };
    });
}

// Fonctions de gestion des messages WebSocket
function handlePing(socket, data) {
    console.log('🏓 Ping received');
    socket.send(JSON.stringify({
        method: 'pong',
        timestamp: new Date().toISOString()
    }));
}

function handleJoinGame(socket, data) {
    console.log('🎮 Player joining game:', data);
    
    socket.send(JSON.stringify({
        method: 'game_joined',
        status: 'success',
        message: 'Successfully joined the game',
        gameId: data.gameId || 'default_game',
        timestamp: new Date().toISOString()
    }));
}

function handleCreateRoom(socket, data) {
    console.log('🏠 Creating room:', data);
    
    const roomId = 'room_' + Date.now();
    
    socket.send(JSON.stringify({
        method: 'room_created',
        status: 'success',
        roomId: roomId,
        roomName: data.roomName,
        gameMode: data.gameMode || 'classic',
        maxPlayers: data.maxPlayers || 2,
        timestamp: new Date().toISOString()
    }));
}

function handleGameMove(socket, data) {
    console.log('🎯 Game move:', data);
    
    // Ici vous ajouteriez la logique du jeu
    socket.send(JSON.stringify({
        method: 'game_update',
        gameState: {
            player1: { x: 10, y: 50, score: 0 },
            player2: { x: 780, y: 50, score: 0 },
            ball: { x: 400, y: 200, vx: 5, vy: 3 },
            timestamp: new Date().toISOString()
        }
    }));
}