import type { Page } from "../interface/gameInterface.js"
import { GameComponentOnline } from "../components/GameComponentOnline.js";
import { ws } from "./TournamentRoom.js";

let currentGame: GameComponentOnline | null = null;

export const GameOnlineTournament: Page = {
  render() {
    return `
      <div class="flex-1 p-5 flex flex-col items-center justify-center bg-gray-900">
        <div class="mb-4 text-center">
          <h1 class="text-4xl font-bold text-white mb-2" id="tournament-match-title">Tournament Match</h1>
          <p class="text-xl text-gray-300" id="match-info">Loading match...</p>
        </div>
        <div id="game-container" class="mb-8">
          <!-- Game component will be mounted here -->
        </div>
        <div class="flex flex-col gap-4 items-center">
          <div class="text-white text-2xl">
            <p>Player : { W / S } keys & { ↑ / ↓ } keys</p>
          </div>
        </div>
      </div>
    `;
  },

  mount(root) {
    // Extraire le roomId depuis l'URL (?gameId=...)
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    let roomId = urlParams.get('gameId');
    
    // Sauvegarder le roomId dans localStorage
    if (roomId) {
      localStorage.setItem('roomId', roomId);
    } else {
      // Fallback vers localStorage si pas dans l'URL
      roomId = localStorage.getItem('roomId');
    }
    
    const clientId = localStorage.getItem('clientId');
    const tournamentId = localStorage.getItem('tournamentId');
    let canStart = false;
    let waiting = true;

    const gameContainer = root.querySelector('#game-container') as HTMLElement;
    const matchTitleEl = root.querySelector('#tournament-match-title') as HTMLElement;
    const matchInfoEl = root.querySelector('#match-info') as HTMLElement;

    currentGame = new GameComponentOnline(gameContainer, canStart, ws, 'moveT');
    currentGame.setCanStart(canStart);

    // Afficher les infos du match si disponibles
    const matchRound = localStorage.getItem('matchRound');
    const matchOpponent = localStorage.getItem('matchOpponent');
    const playerName = localStorage.getItem('username') || 'Player';
    
    if (matchRound) {
      matchTitleEl.textContent = matchRound;
    }
    if (matchOpponent) {
      matchInfoEl.textContent = `${playerName} VS ${matchOpponent}`;
    }

    // Le match de tournoi est géré directement par le serveur
    // Pas besoin d'envoyer "ready", on attend juste les messages du serveur

    if (ws) {
      ws.onmessage = message => {
        const response = JSON.parse(message.data);

        // Début du match
        if (response.method === "Start") {
          waiting = false;
          canStart = true;
          if (currentGame)
            currentGame.setCanStart(canStart);
          
          if (matchInfoEl) {
            matchInfoEl.textContent = `VS ${matchOpponent || 'Opponent'} - Match in progress!`;
          }
        }

        // Mise à jour de l'état du jeu
        if (response.method === "update") {
          const game = response.room;
          if (currentGame && game) {
            currentGame.updateGameState(game);
          }
        }

        // Fin du match
        if (response.method === "gameEnd") {
          const winner = response.winner;
          const score1 = response.score1;
          const score2 = response.score2;
          
          if (matchInfoEl) {
            matchInfoEl.textContent = `Match finished! ${score1} - ${score2}`;
          }
          
          if (currentGame) {
            currentGame.destroy();
          }

          // Attendre un peu avant de rediriger vers le bracket
          setTimeout(() => {
            // Le backend enverra returnToBracket qui gérera la redirection
            console.log('Waiting for returnToBracket signal...');
          }, 2000);
        }

        // Retour au bracket (envoyé par le backend après le match)
        if (response.method === "returnToBracket") {
          console.log('Returning to tournament bracket...');
          
          // Nettoyer les infos du match
          localStorage.removeItem('matchRound');
          localStorage.removeItem('matchOpponent');
          
          // Sauvegarder le tournamentId pour revenir au bon tournoi
          if (response.tournamentId) {
            localStorage.setItem('tournamentId', response.tournamentId);
          }
          
          // Rediriger vers la page du tournoi après un délai
          setTimeout(() => {
            window.location.hash = '/tournamentOnline';
          }, 2000);
        }
      }
    }

    // Cleanup du jeu précédent s'il existe
    if (currentGame) {
      currentGame.destroy();
    }

    // Handler pour le changement de hash (si le joueur quitte manuellement)
    const hashChangeHandler = (event: HashChangeEvent) => {
      console.log('Hash changed - leaving tournament match');
      
      const payLoad = {
        "method": "leave",
        "clientId": clientId
      }
      if (ws)
        ws.send(JSON.stringify(payLoad));

      // Nettoyer les infos du match
      localStorage.removeItem('matchRound');
      localStorage.removeItem('matchOpponent');

      window.removeEventListener('hashchange', hashChangeHandler);
    };
    
    window.addEventListener('hashchange', hashChangeHandler);
  }
}
