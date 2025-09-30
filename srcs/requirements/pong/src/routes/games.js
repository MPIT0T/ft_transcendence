const Clients = require('./clients.js');
const Rooms = require('./rooms.js');

class Games {
	constructor() {
		this._clients = new Clients();
		this._rooms = new Rooms();
	}

	createClient(socket){
		const clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
		_clients.createClient(clientId, socket);
		
		socket.send(JSON.stringify({
			method: 'connect',
			clientId: clientId
		}));
		return clientId;
	}

	createRoom(socket, gameMode, gamePoint, roomName){
		const roomId = 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

		this._rooms.createRoom(roomId, gameMode, gamePoint, roomName)

		const room = this._rooms.find(roomId)


		socket.send(JSON.stringify({
			"method": "create",
			"room" : room.toJSON()
		}));
	}
	
	
	findClient(id) {return this._clients.find(id);}
	findRoom(id) {return this._rooms.find(id);}


	removeClient(id) {return this._clients.remove(id);}
	removeRoom(id) {return this._rooms.remove(id);}

	send(){
		
	}



}

module.exports = Games;