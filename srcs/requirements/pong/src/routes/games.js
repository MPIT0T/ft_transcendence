const Clients = require('./clients.js');
const Rooms = require('./rooms.js');

class Games {
    constructor() {
        _clients = new Clients();
        _rooms = new Rooms();
    }
    
    
    findClient(id) {return this._clients.find(id);}
    findRoom(id) {return this._rooms.find(id);}


    removeClient(id) {return this._clients.remove(id);}
    removeRoom(id) {return this._rooms.remove(id);}

    send(){
        
    }



}

module.exports = Games;