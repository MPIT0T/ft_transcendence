import type { Page } from "../interface/gameInterface.js"
import { ws } from "./GameRoom.js";

interface Player {
  clientId: string;
  name: string;
}

export const TournamentOnline: Page = {
  render() {
    return `
<div class="max-w-6xl mx-auto p-6 pt-20 space-y-10">
  <div class="flex-1 p-5 bg-transparent text-white">
    <!-- Header avec style arcade -->
    <div class="mx-auto mb-8">
      <div class="flex items-center justify-center mb-4 border-1 border-gray-50 p-4 backdrop-blur-2xs">
        <h1 class="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:400%_400%] animate-gradientShift">
          tournoi
        </h1>
      </div>

    </div>

    <!-- Tournament Bracket avec style rétro Pong -->
    <div class="mx-auto">
      <div class="flex justify-center items-start gap-8">
        <!-- Round 1: Quarter Finals -->
        <div class="flex flex-col gap-8">
          <div class="text-center mb-4 border-1 border-gray-50 p-2 backdrop-blur-2xs">
            <h3 class="text-2xl font-bold text-white">Quart de Finale</h3>
          </div>
          <div class="flex flex-col gap-6">
            <!-- Match 1 -->
            <div class="border-1 border-gray-50 p-3 w-64 backdrop-blur-2xs">
              <div class="player-slot p-2 mb-1 border-1 border-gray-50" data-slot="0">
                <span class="player-name text-gray-400">waiting...</span>
              </div>
              <div class="text-center text-white text-lg my-1">- VS -</div>
              <div class="player-slot p-2 border-1 border-gray-50" data-slot="1">
                <span class="player-name text-gray-400">waiting...</span>
              </div>
            </div>

            <!-- Match 2 -->
            <div class="border-1 border-gray-50 p-3 w-64 backdrop-blur-2xs">
              <div class="player-slot p-2 mb-1 border-1 border-gray-50" data-slot="2">
                <span class="player-name text-gray-400">waiting...</span>
              </div>
              <div class="text-center text-white text-lg my-1">- VS -</div>
              <div class="player-slot p-2 border-1 border-gray-50" data-slot="3">
                <span class="player-name text-gray-400">waiting...</span>
              </div>
            </div>

            <!-- Match 3 -->
            <div class="border-1 border-gray-50 p-3 w-64 backdrop-blur-2xs">
              <div class="player-slot p-2 mb-1 border-1 border-gray-50" data-slot="4">
                <span class="player-name text-gray-400">waiting...</span>
              </div>
              <div class="text-center text-white text-lg my-1">- VS -</div>
              <div class="player-slot p-2 border-1 border-gray-50" data-slot="5">
                <span class="player-name text-gray-400">waiting...</span>
              </div>
            </div>

            <!-- Match 4 -->
            <div class="border-1 border-gray-50 p-3 w-64 backdrop-blur-2xs">
              <div class="player-slot p-2 mb-1 border-1 border-gray-50" data-slot="6">
                <span class="player-name text-gray-400">waiting...</span>
              </div>
              <div class="text-center text-white text-lg my-1">- VS -</div>
              <div class="player-slot p-2 border-1 border-gray-50" data-slot="7">
                <span class="player-name text-gray-400">waiting...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Round 2: Semi Finals -->
        <div class="flex flex-col gap-8">
          <div class="text-center mb-4 border-1 border-gray-50 p-2 backdrop-blur-2xs">
            <h3 class="text-2xl font-bold text-white">Semi-Finale</h3>
          </div>
          <div class="flex flex-col gap-32 mt-24">
            <!-- Semi 1 -->
            <div class="border-1 border-gray-50 p-3 w-64 backdrop-blur-2xs">
              <div class="p-2 mb-1 border-1 border-gray-50">
                <span class="text-gray-400">TBD</span>
              </div>
              <div class="text-center text-white text-lg my-1">- VS -</div>
              <div class="p-2 border-1 border-gray-50">
                <span class="text-gray-400">TBD</span>
              </div>
            </div>

            <!-- Semi 2 -->
            <div class="border-1 border-gray-50 p-3 w-64 backdrop-blur-2xs">
              <div class="p-2 mb-1 border-1 border-gray-50">
                <span class="text-gray-400">TBD</span>
              </div>
              <div class="text-center text-white text-lg my-1">- VS -</div>
              <div class="p-2 border-1 border-gray-50">
                <span class="text-gray-400">TBD</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Round 3: Final -->
        <div class="flex flex-col gap-8">
          <div class="text-center mb-4 border-1 border-gray-50 p-2 backdrop-blur-2xs">
            <h3 class="text-2xl font-bold text-white">Finale</h3>
          </div>
          <div class="flex flex-col justify-center min-h-[600px]">
            <div class="border-1 border-gray-50 p-3 w-64 backdrop-blur-2xs">
              <div class="p-2 mb-1 border-1 border-gray-50">
                <span class="text-gray-400">TBD</span>
              </div>
              <div class="text-center text-white text-lg my-1">- VS -</div>
              <div class="p-2 border-1 border-gray-50">
                <span class="text-gray-400">TBD</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Winner -->
        <div class="flex flex-col gap-8">
          <div class="text-center mb-4 border-1 border-gray-50 p-2 backdrop-blur-2xs">
            <h3 class="text-2xl font-bold text-white">Vainqueur</h3>
          </div>
          <div class="flex flex-col justify-center min-h-[600px]">
            <div class="border-1 border-gray-50 p-8 text-center backdrop-blur-2xs">
              <div class="text-6xl mb-4 text-white">🏆</div>
              <div class="text-gray-400">TBD</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Leave Button -->
    <div class="text-center mt-8">
      <button 
          id="leave-tournament-btn"
          class="px-8 py-3 backdrop-blur-2xs hover:bg-gray-700 hover:bg-opacity-40 font-semibold transition-all transform border-1 border-gray-50 hover:border-red-500">
        Quitter le Tournoi
      </button>
    </div>
  </div>
</div>
		`;
  },

  mount(root: HTMLElement): void {
    const tournamentId = localStorage.getItem('tournamentId');
    const clientId = localStorage.getItem('clientId');

    const tournamentNameEl = root.querySelector('#tournament-name') as HTMLElement;
    const playerCountEl = root.querySelector('#player-count') as HTMLElement;
    const playersListEl = root.querySelector('#players-list') as HTMLElement;
    const leaveTournamentBtn = root.querySelector('#leave-tournament-btn') as HTMLButtonElement;

    const payLoad = {
      "method": "ready",
      "clientId": clientId,
      "tournamentId": tournamentId,
      "state": 1,
    }
    if (ws)
      ws.send(JSON.stringify(payLoad));

    if (ws)
      ws.onmessage = message => {
        const response = JSON.parse(message.data);

        if (response.method === "clientJoined") {
          // add client to list and count
        } else if (response.method === "clientLeft") {
          // remove client from list and count
        }
      }

    const hashChangeHandler = (event: HashChangeEvent) => {
      console.log('Hash changed');
      const payLoad = {
        "method": "leave",
        "clientId": clientId
      }
      if (ws)
        ws.send(JSON.stringify(payLoad));

      window.removeEventListener('hashchange', hashChangeHandler);
    };
    window.addEventListener('hashchange', hashChangeHandler);
  }
};
