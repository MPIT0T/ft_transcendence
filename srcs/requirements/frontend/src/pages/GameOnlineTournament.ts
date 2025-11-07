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
  const urlParams = new URLSearchParams(window.location.search);
  let roomId = urlParams.get('gameId');
    
    // Sauvegarder le roomId dans sessionStorage
    if (roomId) {
      sessionStorage.setItem('roomId', roomId);
    } else {
      // Fallback vers sessionStorage si pas dans l'URL
      roomId = sessionStorage.getItem('roomId');
    }
    
    const clientId = sessionStorage.getItem('clientId');
    const tournamentId = sessionStorage.getItem('tournamentId');
    let canStart = false;
    let waiting = true;

    const gameContainer = root.querySelector('#game-container') as HTMLElement;
    const matchTitleEl = root.querySelector('#tournament-match-title') as HTMLElement;
    const matchInfoEl = root.querySelector('#match-info') as HTMLElement;

    currentGame = new GameComponentOnline(gameContainer, canStart, ws, 'moveT');
    currentGame.setCanStart(canStart);

    // Afficher les infos du match si disponibles
    const matchRound = sessionStorage.getItem('matchRound');
    const matchOpponent = sessionStorage.getItem('matchOpponent');
    const playerName = sessionStorage.getItem('username') || 'Player';
    
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
          }, 2000);
        }

        // Retour au bracket (envoyé par le backend après le match)
        if (response.method === "returnToBracket") {
          
          // Nettoyer les infos du match
          sessionStorage.removeItem('matchRound');
          sessionStorage.removeItem('matchOpponent');
          
          // Sauvegarder le tournamentId pour revenir au bon tournoi
          if (response.tournamentId) {
            sessionStorage.setItem('tournamentId', response.tournamentId);
          }
          
          // Rediriger vers la page du tournoi après un délai (History API)
          setTimeout(() => {
            const p = '/tournamentOnline';
            history.pushState(null, '', p);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }, 2000);
        }
      }
    }

    // Cleanup du jeu précédent s'il existe
    if (currentGame) {
      currentGame.destroy();
    }

  // Handler pour le popstate (si le joueur quitte manuellement)
  const popstateHandler = (event: PopStateEvent) => {
      
      const payLoad = {
        "method": "leave",
        "clientId": clientId
      }
      if (ws)
        ws.send(JSON.stringify(payLoad));

      // Nettoyer les infos du match
      sessionStorage.removeItem('matchRound');
      sessionStorage.removeItem('matchOpponent');

      window.removeEventListener('popstate', popstateHandler);
    };

    window.addEventListener('popstate', popstateHandler);
  }
}
