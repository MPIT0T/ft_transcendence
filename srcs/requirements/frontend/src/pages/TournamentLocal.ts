import type { Page } from "../interface/gameInterface.js"
import { Layout } from "./Layout";
import { GameComponent } from "../components/GameComponent.js";
import { createCountdown } from "../utils/countdown.js"

// ============================================
// Tournament State
// ============================================
let tournamentPlayers: string[] = [];
let tournamentBracket: { round: number; matches: { player1: string; player2: string; winner?: string; score1?: number; score2?: number }[] }[] = [];
let currentMatchIndex = 0;
let currentRound = 0;
let currentGame: GameComponent | null = null;
let winningScore: number = 5;
let currentScore1: number = 0;
let currentScore2: number = 0;

// ============================================
// Utility Functions
// ============================================
function shuffleArray<T>(array: T[]): T[] {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

function generateBracket() {
	const shuffled = shuffleArray(tournamentPlayers);
	tournamentBracket = [];
	currentRound = 0;
	currentMatchIndex = 0;
	
	const firstRoundMatches: { player1: string; player2: string; winner?: string; score1?: number; score2?: number }[] = [];
	for (let i = 0; i < shuffled.length; i += 2) {
		firstRoundMatches.push({
			player1: shuffled[i],
			player2: shuffled[i + 1],
			winner: undefined,
			score1: undefined,
			score2: undefined
		});
	}
	tournamentBracket.push({ round: 1, matches: firstRoundMatches });
}

function generateNextRound() {
	const lastRound = tournamentBracket[tournamentBracket.length - 1];
	if (!lastRound || lastRound.matches.length <= 1) return;
	
	const winners = lastRound.matches.map(m => m.winner).filter(Boolean) as string[];
	const nextRoundMatches: { player1: string; player2: string; winner?: string; score1?: number; score2?: number }[] = [];
	
	for (let i = 0; i < winners.length; i += 2) {
		nextRoundMatches.push({
			player1: winners[i],
			player2: winners[i + 1],
			winner: undefined,
			score1: undefined,
			score2: undefined
		});
	}
	
	if (nextRoundMatches.length > 0) {
		tournamentBracket.push({ round: tournamentBracket.length + 1, matches: nextRoundMatches });
	}
}

// Always 8 players: 4 matches = Quarts, 2 matches = Semis, 1 match = Finale
function getRoundName(matchCount: number): string {
	if (matchCount === 1) return 'Finale';
	if (matchCount === 2) return 'Demi-finale';
	if (matchCount === 4) return 'Quart de finale';
	return `Tour`;
}

function getBracketHTML(): string {
	// Build a consistent set of rounds so all matches are visible even if not played yet
	const firstRoundMatches = tournamentBracket[0]?.matches || [];
	const playersCount = Math.max(2, tournamentPlayers.length || (firstRoundMatches.length * 2));
	const expectedRounds = Math.max(1, Math.ceil(Math.log2(playersCount)));

	// Determine first round match count (fallback to 4 matches for 8 players)
	const firstMatchCount = firstRoundMatches.length || Math.floor(playersCount / 2) || 4;

	let html = '<div class="flex justify-center items-start gap-8">';

	for (let roundIndex = 0; roundIndex < expectedRounds; roundIndex++) {
		// calculate number of matches in this round
		const matchesCount = Math.max(1, Math.ceil(firstMatchCount / Math.pow(2, roundIndex)));
		const round = tournamentBracket[roundIndex];
		const roundName = getRoundName(matchesCount);

		// vertical offset to visually align later rounds
		let marginTopClass = '';
		if (roundIndex === 1) marginTopClass = 'mt-24';
		if (roundIndex === 2) marginTopClass = 'mt-48';

		html += `
			<div class="flex flex-col min-w-[200px] gap-8">
				<div class="text-center border border-gray-50 p-2 backdrop-blur-2xs">
					<h3 class="text-2xl font-bold text-white">${roundName}</h3>
				</div>
				<div class="flex flex-col gap-8 ${marginTopClass}">`;

		for (let matchIndex = 0; matchIndex < matchesCount; matchIndex++) {
			const match = round?.matches?.[matchIndex] || { player1: '', player2: '', winner: undefined, score1: undefined, score2: undefined };
			const isCurrentMatch = roundIndex === currentRound && matchIndex === currentMatchIndex;
			const isPlayed = match.winner !== undefined;

			const p1Won = match.winner === match.player1;
			const p2Won = match.winner === match.player2;
			const p1BgClass = p1Won ? 'bg-green-700' : '';
			const p2BgClass = p2Won ? 'bg-green-700' : '';

			const score1 = isPlayed ? match.score1 : '';
			const score2 = isPlayed ? match.score2 : '';

			html += `
				<div class="border border-gray-50 p-3 backdrop-blur-2xs ${isCurrentMatch && !isPlayed ? 'border-green-500 border-2' : ''}">
					<div class="p-2 mb-1 border border-gray-50 backdrop-blur-2xs ${p1BgClass}">
						<span class="text-white">${match.player1 || ''}</span>
					</div>
					<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3">
						<span class="text-yellow-400 font-bold">${score1}</span>
						<span>- VS -</span>
						<span class="text-yellow-400 font-bold">${score2}</span>
					</div>
					<div class="p-2 border border-gray-50 backdrop-blur-2xs ${p2BgClass}">
						<span class="text-white">${match.player2 || ''}</span>
					</div>
				</div>`;
		}

		html += '</div></div>';
	}

	html += '</div>';
	return html;
}

function getProgressText(): string {
	const totalMatches = tournamentPlayers.length - 1;
	let playedMatches = 0;
	tournamentBracket.forEach(round => {
		playedMatches += round.matches.filter(m => m.winner).length;
	});
	return `Match ${playedMatches + 1}/${totalMatches}`;
}

function resetTournament() {
	tournamentPlayers = [];
	tournamentBracket = [];
	currentMatchIndex = 0;
	currentRound = 0;
	winningScore = 5;
	currentScore1 = 0;
	currentScore2 = 0;
	if (currentGame) {
		currentGame.destroy();
		currentGame = null;
	}
	
	// countdown abort handled by page mount scope if necessary
	
}

// ============================================
// Page Component
// ============================================
export const TournamentLocal: Page = {
	render() {
		return `
<div class="flex flex-col items-center justify-center pt-16 pb-8">
	<!-- Phase d'inscription -->
	<div id="registration-phase" class="backdrop-blur-2xs border border-gray-50 p-8 w-[420px] mx-4">
		<div class="text-center mb-6">
			<h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 mb-2">
				🏆 Tournoi Local
			</h1>
			<p class="text-gray-400">Élimination directe - 4 ou 8 joueurs</p>
		</div>
		
		<div class="mb-6">
			<div class="flex gap-2 mb-4">
				<input 
					type="text" 
					id="tournament-player-input"
					class="flex-1 px-3 py-2 border border-gray-400 bg-transparent text-gray-200 focus:outline-none focus:border-green-500 transition-colors"
					placeholder="Nom du joueur (3-12 caractères)"
					pattern="^[a-zA-Z0-9]{3,12}$"
					maxlength="12"
					autocomplete="off"
				>
				<button 
					id="add-player-btn"
					class="px-4 py-2 border border-gray-50 text-gray-50 hover:bg-green-500/20 hover:border-green-500 transition-colors">
					Ajouter
				</button>
			</div>
			
			<div class="flex justify-between items-center mb-2">
				<span class="text-gray-400">Joueurs inscrits:</span>
				<span id="player-count" class="text-gray-200 font-bold">0/8</span>
			</div>
			
			<div id="players-list" class="h-48 overflow-y-auto mb-4 space-y-2"></div>
			
			<p id="player-hint" class="text-sm text-gray-500 text-center">
				Ajoutez 4 ou 8 joueurs pour commencer
			</p>
		</div>

		<!-- Choix du nombre de points -->
		<div class="mb-6">
			<label class="text-gray-400 block mb-3 text-center">Points pour gagner un match :</label>
			<div class="flex gap-2 justify-center">
				<button class="score-option px-5 py-2 border border-gray-600 text-gray-400 hover:border-gray-50 hover:text-gray-50 transition-colors" data-score="3">3</button>
				<button class="score-option px-5 py-2 border border-yellow-500 text-yellow-400 bg-yellow-500/20" data-score="5">5</button>
				<button class="score-option px-5 py-2 border border-gray-600 text-gray-400 hover:border-gray-50 hover:text-gray-50 transition-colors" data-score="10">10</button>
				<button class="score-option px-5 py-2 border border-gray-600 text-gray-400 hover:border-gray-50 hover:text-gray-50 transition-colors" data-score="15">15</button>
			</div>
		</div>
		
		<div class="flex gap-4">
			<button 
				id="start-tournament-btn"
				class="flex-1 py-3 font-bold text-xl border border-gray-50 text-gray-50 hover:bg-green-500/20 hover:border-green-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-50"
				disabled>
				🚀 Lancer le tournoi
			</button>
			<button 
				id="back-btn"
				class="px-6 py-3 font-bold border border-gray-50 text-gray-50 hover:bg-red-500/20 hover:border-red-500 transition-colors">
				Retour
			</button>
		</div>
	</div>

	<!-- Phase de jeu (hidden par défaut) -->
	<div id="game-phase" class="hidden flex flex-col items-center w-full px-4 pt-16">
		<!-- Titre du match -->
		<div id="match-title" class="text-5xl text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:400%_400%] animate-gradientShift">
			Demi-finale 1
		</div>
		
		<!-- Header du match -->
		<div class="relative overflow-hidden text-gray-50 text-lg border border-gray-50 mb-4 w-full max-w-[900px]">
			<div class="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-30"></div>
			<div class="relative z-10">
				<div class="flex items-center px-6 pt-2">
					<span id="player1-name" class="font-semibold text-4xl flex-1 text-left text-white">Joueur 1</span>
					<span id="score" class="text-4xl font-extrabold tracking-wide">0 : 0</span>
					<span id="player2-name" class="font-semibold text-4xl flex-1 text-right text-white">Joueur 2</span>
				</div>
				<div class="flex items-center justify-between px-6 pb-2 text-sm opacity-90">
					<span class="flex-1 text-left text-gray-400">W / S</span>
					<span id="winning-score-info" class="text-gray-400">Premier à <span id="winning-score-display" class="text-yellow-400 font-bold">5</span></span>
					<span class="flex-1 text-right text-gray-400">↑ / ↓</span>
				</div>
			</div>
		</div>

		<!-- Zone de jeu - taille fixe du canvas -->
		<div id="game-container" class="mb-4"></div>
		
		<!-- Boutons -->
		<div class="flex gap-3 items-center flex-wrap justify-center">
			<button
				id="show-bracket-btn"
				class="px-4 py-2 font-bold text-sm transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-yellow-500/20 hover:border-yellow-500">
				📊 Bracket
			</button>
			<button
				id="play-btn"
				class="px-8 py-3 font-bold text-lg transition border-2 border-green-500 backdrop-blur-2xs text-green-400 hover:bg-green-500/20">
				▶ Jouer
			</button>
			<button
				id="quit-tournament-btn"
				class="px-4 py-2 font-bold text-sm transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-red-500/20 hover:border-red-500">
				✕ Quitter
			</button>
		</div>
	</div>

	<!-- Modal countdown -->
	<div id="countdown-modal" class="fixed inset-0 flex justify-center items-center z-75 hidden bg-black/50">
		<div id="countdown-text" class="text-8xl font-bold text-gray-50 text-center px-16 py-16 transition-all duration-150">
			3
		</div>
	</div>

	<!-- Modal Bracket -->
	<div id="bracket-modal" class="fixed inset-0 backdrop-blur-lg bg-black/70 hidden items-center justify-center z-50">
		<div class="border border-gray-50 bg-gray-900/90 p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
			<div class="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
				<h3 class="text-2xl text-yellow-400 font-bold">📊 Bracket du tournoi</h3>
				<button id="close-bracket-btn" class="text-gray-400 hover:text-white text-3xl transition-colors">&times;</button>
			</div>
			<div id="bracket-modal-content" class="mb-6"></div>
			<div id="bracket-next-match" class="mt-6 pt-6 border-t border-gray-700 text-center hidden">
				<p class="text-gray-400 mb-3 text-sm uppercase tracking-wider">Prochain match</p>
				<p class="text-3xl mb-6">
					<span id="next-player1" class="text-blue-400 font-bold"></span>
					<span class="text-yellow-400 mx-4 font-bold">VS</span>
					<span id="next-player2" class="text-red-400 font-bold"></span>
				</p>
				<button 
					id="start-next-match-btn"
					class="px-10 py-4 text-white border-2 border-green-500 hover:bg-green-500/20 transition-colors font-bold text-lg">
					▶ Commencer le match
				</button>
			</div>
		</div>
	</div>

	<!-- Modal match terminé -->
	<div id="match-end-modal" class="fixed inset-0 backdrop-blur-lg bg-black/70 hidden items-center justify-center z-50">
		<div class="border border-gray-50 bg-gray-900/90 p-8 max-w-md w-full mx-4 text-center">
			<div class="text-6xl mb-4">🎉</div>
			<h3 class="text-2xl text-gray-300 font-bold mb-2">Match terminé !</h3>
			<p class="text-gray-400 text-sm mb-4">Vainqueur</p>
			<p id="match-winner-name" class="text-4xl text-green-400 font-bold mb-2"></p>
			<p id="match-final-score" class="text-xl text-gray-400 mb-6"></p>
			<button 
				id="show-bracket-after-match-btn"
				class="w-full py-4 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 transition-colors font-bold text-lg">
				📊 Voir le bracket →
			</button>
		</div>
	</div>

	<!-- Modal tournoi terminé -->
	<div id="tournament-end-modal" class="fixed inset-0 backdrop-blur-lg bg-black/70 hidden items-center justify-center z-50">
		<div class="border border-yellow-500 bg-gray-900/90 p-8 max-w-md w-full mx-4 text-center">
			<div class="text-6xl mb-4">🏆</div>
			<h3 class="text-3xl text-yellow-400 font-bold mb-6">TOURNOI TERMINÉ</h3>
			<p class="text-gray-400 text-sm uppercase tracking-wider mb-2">Le champion est</p>
			<p id="tournament-champion" class="text-5xl text-green-400 font-bold mb-8 animate-pulse"></p>
			<div class="space-y-3">
				<button 
					id="show-final-bracket-btn"
					class="w-full py-3 text-white border border-gray-50 hover:bg-gray-700/50 transition-colors font-bold">
					📊 Voir le bracket final
				</button>
						<button
							id="back-to-local-lobby-btn"
							class="w-full py-3 text-white border border-gray-50 hover:bg-gray-700/50 transition-colors font-bold">
							↩ Retour au lobby
						</button>
				<button 
					id="new-tournament-btn"
					class="w-full py-3 text-white border-2 border-green-500 hover:bg-green-500/20 transition-colors font-bold">
					🔄 Nouveau tournoi
				</button>
			</div>
		</div>
	</div>
</div>
		`;
	},

	mount(root: HTMLElement): void {
		// Reset state
		resetTournament();

		// ============================================
		// DOM Elements
		// ============================================
		const registrationPhase = root.querySelector('#registration-phase') as HTMLDivElement;
		const gamePhase = root.querySelector('#game-phase') as HTMLDivElement;
		const playerInput = root.querySelector('#tournament-player-input') as HTMLInputElement;
		const addPlayerBtn = root.querySelector('#add-player-btn') as HTMLButtonElement;
		const playersList = root.querySelector('#players-list') as HTMLDivElement;
		const playerCount = root.querySelector('#player-count') as HTMLSpanElement;
		const playerHint = root.querySelector('#player-hint') as HTMLParagraphElement;
		const startTournamentBtn = root.querySelector('#start-tournament-btn') as HTMLButtonElement;
		const backBtn = root.querySelector('#back-btn') as HTMLButtonElement;
		const gameContainer = root.querySelector('#game-container') as HTMLElement;
		const scoreEl = root.querySelector('#score') as HTMLElement;
		const player1Name = root.querySelector('#player1-name') as HTMLElement;
		const player2Name = root.querySelector('#player2-name') as HTMLElement;
		const matchTitle = root.querySelector('#match-title') as HTMLElement;
		const winningScoreDisplay = root.querySelector('#winning-score-display') as HTMLElement;
		const playBtn = root.querySelector('#play-btn') as HTMLButtonElement;
		const showBracketBtn = root.querySelector('#show-bracket-btn') as HTMLButtonElement;
		const quitBtn = root.querySelector('#quit-tournament-btn') as HTMLButtonElement;
		const countdownModal = root.querySelector('#countdown-modal') as HTMLDivElement;
		const countdownText = root.querySelector('#countdown-text') as HTMLDivElement;
		const bracketModal = root.querySelector('#bracket-modal') as HTMLDivElement;
		const bracketModalContent = root.querySelector('#bracket-modal-content') as HTMLDivElement;
		const closeBracketBtn = root.querySelector('#close-bracket-btn') as HTMLButtonElement;
		const bracketNextMatch = root.querySelector('#bracket-next-match') as HTMLDivElement;
		const nextPlayer1 = root.querySelector('#next-player1') as HTMLSpanElement;
		const nextPlayer2 = root.querySelector('#next-player2') as HTMLSpanElement;
		const startNextMatchBtn = root.querySelector('#start-next-match-btn') as HTMLButtonElement;
		const matchEndModal = root.querySelector('#match-end-modal') as HTMLDivElement;
		const matchWinnerName = root.querySelector('#match-winner-name') as HTMLSpanElement;
		const matchFinalScore = root.querySelector('#match-final-score') as HTMLSpanElement;
		const showBracketAfterMatchBtn = root.querySelector('#show-bracket-after-match-btn') as HTMLButtonElement;
		const tournamentEndModal = root.querySelector('#tournament-end-modal') as HTMLDivElement;
		const tournamentChampion = root.querySelector('#tournament-champion') as HTMLSpanElement;
		const showFinalBracketBtn = root.querySelector('#show-final-bracket-btn') as HTMLButtonElement;
		const newTournamentBtn = root.querySelector('#new-tournament-btn') as HTMLButtonElement;
		const backToLocalLobbyBtn = root.querySelector('#back-to-local-lobby-btn') as HTMLButtonElement;
		const scoreOptions = root.querySelectorAll('.score-option');

		let canStart = false;
		let isTournamentFinished = false;
		let canCloseBracketModal = true; // Track if modal can be closed by clicking outside

		// ============================================
		// Score Selection
		// ============================================
		scoreOptions.forEach(btn => {
			btn.addEventListener('click', () => {
				scoreOptions.forEach(b => {
					b.classList.remove('border-yellow-500', 'text-yellow-400', 'bg-yellow-500/20');
					b.classList.add('border-gray-600', 'text-gray-400');
				});
				btn.classList.remove('border-gray-600', 'text-gray-400');
				btn.classList.add('border-yellow-500', 'text-yellow-400', 'bg-yellow-500/20');
				winningScore = parseInt((btn as HTMLButtonElement).dataset.score || '5');
			});
		});

		// Use shared countdown util for identical 1-2-3 animation
		const countdown = createCountdown();

		// ============================================
		// Bracket Modal
		// ============================================
		const showBracket = (showNextMatchInfo: boolean = false) => {
			bracketModalContent.innerHTML = getBracketHTML();
			
			if (showNextMatchInfo && !isTournamentFinished) {
				const match = tournamentBracket[currentRound]?.matches[currentMatchIndex];
				if (match && !match.winner) {
					nextPlayer1.textContent = match.player1;
					nextPlayer2.textContent = match.player2;
					bracketNextMatch.classList.remove('hidden');
					// Cannot close modal when showing next match - must click button
					canCloseBracketModal = false;
					closeBracketBtn.classList.add('hidden');
				} else {
					bracketNextMatch.classList.add('hidden');
					canCloseBracketModal = true;
					closeBracketBtn.classList.remove('hidden');
				}
			} else {
				bracketNextMatch.classList.add('hidden');
				canCloseBracketModal = true;
				closeBracketBtn.classList.remove('hidden');
			}
			
			bracketModal.classList.remove('hidden');
			bracketModal.classList.add('flex');
		};

		const hideBracket = () => {
			bracketModal.classList.add('hidden');
			bracketModal.classList.remove('flex');
			canCloseBracketModal = true; // Reset when hidden
		};

		// ============================================
		// Update Match Info Display
		// ============================================
		const updateMatchInfo = () => {
			const round = tournamentBracket[currentRound];
			if (round) {
				const roundName = getRoundName(round.matches.length);
				const matchNum = currentMatchIndex + 1;
				// Format title like "Demi-finale 1" or just "Finale"
				if (round.matches.length === 1) {
					matchTitle.textContent = roundName;
				} else {
					matchTitle.textContent = `${roundName} ${matchNum}`;
				}
			}
			winningScoreDisplay.textContent = String(winningScore);
		};

		// ============================================
		// Players List Management
		// ============================================
		const updatePlayersList = () => {
			if (tournamentPlayers.length === 0) {
				playersList.innerHTML = '<p class="text-gray-500 text-center py-4 italic">Aucun joueur inscrit</p>';
			} else {
				playersList.innerHTML = tournamentPlayers.map((player, index) => `
					<div class="flex items-center justify-between px-3 py-2 border border-gray-600 hover:border-gray-400 transition-colors group">
						<span class="text-gray-200">
							<span class="text-gray-500 mr-2">${index + 1}.</span>
							${player}
						</span>
						<button class="remove-player-btn text-gray-500 hover:text-red-400 px-2 opacity-50 group-hover:opacity-100 transition-opacity" data-player="${player}" title="Retirer">✕</button>
					</div>
				`).join('');

				playersList.querySelectorAll('.remove-player-btn').forEach(btn => {
					btn.addEventListener('click', () => {
						const name = (btn as HTMLButtonElement).dataset.player;
						if (name) {
							tournamentPlayers = tournamentPlayers.filter(p => p !== name);
							updatePlayersList();
							Layout.showNotification(`${name} retiré du tournoi`, 'info');
						}
					});
				});
			}

			playerCount.textContent = `${tournamentPlayers.length}/8`;

			const isValid = tournamentPlayers.length === 8;
			
			if (isValid) {
				playerHint.textContent = '✓ Prêt à commencer !';
				playerHint.className = 'text-sm text-green-400 text-center font-bold';
			} else if (tournamentPlayers.length < 8) {
				playerHint.textContent = `Ajoutez encore ${8 - tournamentPlayers.length} joueur(s)`;
				playerHint.className = 'text-sm text-gray-500 text-center';
			} else {
				playerHint.textContent = 'Maximum 8 joueurs atteint';
				playerHint.className = 'text-sm text-gray-500 text-center';
			}
			
			startTournamentBtn.disabled = !isValid;
		};

		// ============================================
		// Add Player
		// ============================================
		const addPlayer = () => {
			const name = playerInput.value.trim();
			
			if (!name) {
				Layout.showNotification('Veuillez entrer un nom', 'error');
				playerInput.focus();
				return;
			}
			
			if (!/^[a-zA-Z0-9]{3,12}$/.test(name)) {
				Layout.showNotification('Le nom doit contenir 3-12 caractères alphanumériques', 'error');
				playerInput.focus();
				return;
			}
			
			if (tournamentPlayers.map(p => p.toLowerCase()).includes(name.toLowerCase())) {
				Layout.showNotification('Ce joueur est déjà inscrit', 'error');
				playerInput.focus();
				return;
			}
			
			if (tournamentPlayers.length >= 8) {
				Layout.showNotification('Maximum 8 joueurs atteint', 'error');
				return;
			}
			
			tournamentPlayers.push(name);
			playerInput.value = '';
			playerInput.focus();
			updatePlayersList();
			Layout.showNotification(`${name} ajouté au tournoi !`, 'success');
		};

		// ============================================
		// Start Match
		// ============================================
		const startMatch = () => {
			const match = tournamentBracket[currentRound]?.matches[currentMatchIndex];
			if (!match) return;

			player1Name.textContent = match.player1;
			player2Name.textContent = match.player2;
			currentScore1 = 0;
			currentScore2 = 0;
			scoreEl.textContent = '0 - 0';
			updateMatchInfo();
			canStart = false;
			playBtn.textContent = '▶ Jouer';
			playBtn.className = "px-8 py-3 font-bold text-lg transition border-2 border-green-500 backdrop-blur-2xs text-green-400 hover:bg-green-500/20";

			// Destroy previous game
			if (currentGame) {
				currentGame.destroy();
				currentGame = null;
			}

			// Create new game
			currentGame = new GameComponent(
				gameContainer,
				false,
				(p1, p2) => {
					currentScore1 = p1;
					currentScore2 = p2;
					scoreEl.textContent = `${p1} - ${p2}`;

					// Check for winner
					if (p1 >= winningScore || p2 >= winningScore) {
						const winner = p1 >= winningScore ? match.player1 : match.player2;
						
						canStart = false;
						if (currentGame) currentGame.setCanStart(false);
						
						// Update bracket with winner and score
						match.winner = winner;
						match.score1 = p1;
						match.score2 = p2;

						// Check if tournament is over (finale)
						const isFinale = tournamentBracket[currentRound].matches.length === 1;
						
						if (isFinale) {
							// Tournament finished!
							isTournamentFinished = true;
							tournamentChampion.textContent = winner;
							setTimeout(() => {
								tournamentEndModal.classList.remove('hidden');
								tournamentEndModal.classList.add('flex');
							}, 500);
						} else {
							// Show match end modal
							matchWinnerName.textContent = winner;
							matchFinalScore.textContent = `Score: ${p1} - ${p2}`;
							setTimeout(() => {
								matchEndModal.classList.remove('hidden');
								matchEndModal.classList.add('flex');
							}, 500);
						}
					}
				},
				async (state: boolean) => {
					// Countdown après chaque but (sauf le dernier)
					if (state) {
						// Vérifier si ce n'est pas le but gagnant
						const isGameOver = currentScore1 >= winningScore || currentScore2 >= winningScore;
						if (!isGameOver) {
							try {
								await countdown.start(countdownModal, countdownText);
							} catch (e: any) {
								if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
							}
						}
					}
				}
			);
		};

		// ============================================
		// Advance to Next Match
		// ============================================
		const advanceToNextMatch = () => {
			currentMatchIndex++;

			if (currentMatchIndex >= tournamentBracket[currentRound].matches.length) {
				// All matches in current round are done, generate next round
				generateNextRound();
				currentRound++;
				currentMatchIndex = 0;
			}
		};

		// ============================================
		// Event Listeners - Registration Phase
		// ============================================
		addPlayerBtn.addEventListener('click', addPlayer);
		
		playerInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				addPlayer();
			}
		});

		backBtn.addEventListener('click', () => {
			history.pushState(null, '', '/localLobby');
			window.dispatchEvent(new PopStateEvent('popstate'));
		});

		startTournamentBtn.addEventListener('click', () => {
			generateBracket();
			isTournamentFinished = false;
			registrationPhase.classList.add('hidden');
			gamePhase.classList.remove('hidden');
			// Show bracket with first match info
			showBracket(true);
		});

		// ============================================
		// Event Listeners - Game Phase
		// ============================================
		showBracketBtn.addEventListener('click', () => {
			// If a game is currently running (canStart === true), prevent
			// opening the bracket. Require the user to pause first.
			if (currentGame && canStart) {
				Layout.showNotification('Mettez le jeu en pause pour ouvrir le bracket', 'info');
				return;
			}
			showBracket(false);
		});

		closeBracketBtn.addEventListener('click', () => {
			if (canCloseBracketModal) hideBracket();
		});

		bracketModal.addEventListener('click', (e) => {
			if (e.target === bracketModal && canCloseBracketModal) hideBracket();
		});

		startNextMatchBtn.addEventListener('click', () => {
			hideBracket();
			startMatch();
		});

		playBtn.addEventListener('click', async () => {
			canStart = !canStart;
			
					if (canStart) {
						playBtn.textContent = '⏸ Pause';
						playBtn.className = "px-8 py-3 font-bold text-lg transition border-2 border-yellow-500 backdrop-blur-2xs text-yellow-400 hover:bg-yellow-500/20";
						try {
							await countdown.start(countdownModal, countdownText);
						} catch (e: any) {
							if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
							canStart = false;
							playBtn.textContent = '▶ Jouer';
							playBtn.className = "px-8 py-3 font-bold text-lg transition border-2 border-green-500 backdrop-blur-2xs text-green-400 hover:bg-green-500/20";
						}
					} else {
						playBtn.textContent = '▶ Jouer';
						playBtn.className = "px-8 py-3 font-bold text-lg transition border-2 border-green-500 backdrop-blur-2xs text-green-400 hover:bg-green-500/20";
						countdown.abort();
					}

			if (currentGame) {
				currentGame.setCanStart(canStart);
			}
		});

		quitBtn.addEventListener('click', () => {
			if (confirm('Êtes-vous sûr de vouloir quitter le tournoi ? Toute progression sera perdue.')) {
				resetTournament();
				history.pushState(null, '', '/localLobby');
				window.dispatchEvent(new PopStateEvent('popstate'));
			}
		});

		// ============================================
		// Event Listeners - Match End Modal
		// ============================================
		showBracketAfterMatchBtn.addEventListener('click', () => {
			// Hide match modal and open bracket; remember origin so closing bracket can restore it
			if (matchEndModal) {
				matchEndModal.classList.add('hidden');
				matchEndModal.classList.remove('flex');
			}
			advanceToNextMatch();
			showBracket(true);
		});

		// ============================================
		// Event Listeners - Tournament End Modal
		// ============================================
		showFinalBracketBtn.addEventListener('click', () => {
			// Hide the tournament-end modal and open the bracket for final view.
			// We intentionally do NOT set an origin so closing the bracket does
			// not reopen the tournament-end modal (prevents unexpected UI loops).
			if (tournamentEndModal) {
				tournamentEndModal.classList.add('hidden');
				tournamentEndModal.classList.remove('flex');
			}
			showBracket(false);
		});

		newTournamentBtn.addEventListener('click', () => {
			tournamentEndModal.classList.add('hidden');
			tournamentEndModal.classList.remove('flex');
			resetTournament();
			registrationPhase.classList.remove('hidden');
			gamePhase.classList.add('hidden');
			updatePlayersList();
		});

		// Back to local lobby from tournament end modal
		if (backToLocalLobbyBtn) {
			backToLocalLobbyBtn.addEventListener('click', () => {
				if (tournamentEndModal) {
					tournamentEndModal.classList.add('hidden');
					tournamentEndModal.classList.remove('flex');
				}
				history.pushState(null, '', '/localLobby');
				window.dispatchEvent(new PopStateEvent('popstate'));
			});
		}

		// ============================================
		// Initialize
		// ============================================
		updatePlayersList();
		playerInput.focus();

		// Cleanup on page leave
		const popstateHandler = () => {
			resetTournament();
			window.removeEventListener('popstate', popstateHandler);
		};
		window.addEventListener('popstate', popstateHandler);
	}
};
