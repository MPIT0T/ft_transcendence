import type { Page } from "../interface/gameInterface.js"
import { GameComponentOnline } from "../components/GameComponentOnline.js";
import { ws } from "./TournamentRoom.js";

let currentGame: GameComponentOnline | null = null;

export const GameOnlineTournament: Page = {
  render() {
    return `
<div id="tournament-match-title" class="text-7xl text-center mb-5 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:400%_400%] animate-gradientShift">
  tournament name
</div>
<div class="relative overflow-hidden text-gray-50 text-lg border-1 border-gray-50 backdrop-blur-2xs">
  <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-30"></div>
  <div class="relative z-10">
    <div class="flex items-center justify-between px-6 pt-2">
      <span id="player-1-name" class="font-semibold text-5xl">???</span>
      <span id="score" class="text-5xl font-extrabold tracking-wide"></span>
      <span id="player-2-name" class="font-semibold text-5xl">???</span>
    </div>
    <div class="flex items-center justify-between px-6 pb-2 text-md opacity-90">
      <span id="player-1-elo"></span>
      <span id="timer">00:00</span>
      <span id="player-2-elo"></span>
    </div>
  </div>
</div>
<div class="flex-1 p-5 flex flex-col items-center justify-center bg-transparent">
  <div id="game-container" class="mb-8"></div>
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
    const player1NameEl = root.querySelector('#player-1-name') as HTMLElement;
    const player2NameEl = root.querySelector('#player-2-name') as HTMLElement;
    const score = root.querySelector('#elo') as HTMLElement;

    currentGame = new GameComponentOnline(
      gameContainer,
      canStart,
      (p1:number , p2: number) => { score.textContent = `${p1} : ${p2}` },
      ws,
      'moveT');
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
          if (currentGame) {
            currentGame.setCanStart(canStart);

          }
          
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
