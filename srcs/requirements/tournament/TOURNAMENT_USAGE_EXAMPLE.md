# 🏆 Guide d'utilisation du système de tournoi avec pré-génération des rooms

## Vue d'ensemble

Pour un tournoi de **8 joueurs**, le système génère automatiquement **7 rooms** au total :
- 4 Quarter Finals
- 2 Semi Finals  
- 1 Final

Toutes ces rooms sont créées **au début** du tournoi (vides) et stockées dans `tournament.allTournamentRooms[]`.

## Structure d'une room pré-générée

```javascript
{
  roomId: 'tournament123_quarter_1',
  roomName: 'Quarter Final 1',
  round: 'Quarter Finals',
  matchNumber: 1,
  player1: null,           // Assigné plus tard
  player2: null,           // Assigné plus tard
  winner: null,            // Déterminé après le match
  score1: null,            // Mis à jour après le match
  score2: null,            // Mis à jour après le match
  status: 'waiting'        // 'waiting' | 'ready' | 'completed'
}
```

## Méthodes disponibles

### 1. `generateAllTournamentRooms()`
Crée toutes les 7 rooms vides au début du tournoi.

```javascript
// Appelé automatiquement quand 8 joueurs sont prêts
tournament.generateAllTournamentRooms();
// ✅ Generated 7 tournament rooms
```

### 2. `getTournamentRoom(round, matchNumber)`
Récupère une room spécifique par son round et son numéro.

```javascript
// Récupérer la 1ère Quarter Final
const qf1 = tournament.getTournamentRoom('Quarter Finals', 1);

// Récupérer la 2ème Semi Final
const sf2 = tournament.getTournamentRoom('Semi Finals', 2);

// Récupérer la Final
const final = tournament.getTournamentRoom('Final', 1);
```

### 3. `assignPlayersToRoom(round, matchNumber, player1, player2)`
Assigne des joueurs à une room spécifique.

```javascript
// Assigner des joueurs à la Quarter Final 1
tournament.assignPlayersToRoom(
  'Quarter Finals', 
  1, 
  playerAlice, 
  playerBob
);
// ✅ Assigned Alice vs Bob to Quarter Final 1
```

## Accéder à toutes les rooms

```javascript
// Voir toutes les rooms du tournoi
console.log(tournament.allTournamentRooms);

// Filtrer par round
const quarterFinals = tournament.allTournamentRooms.filter(
  r => r.round === 'Quarter Finals'
);

const semiFinals = tournament.allTournamentRooms.filter(
  r => r.round === 'Semi Finals'
);

const final = tournament.allTournamentRooms.find(
  r => r.round === 'Final'
);
```

## Modifier manuellement une room

```javascript
// Exemple : Modifier la 3ème Quarter Final
const qf3 = tournament.getTournamentRoom('Quarter Finals', 3);

// Changer les joueurs
qf3.player1 = newPlayer1;
qf3.player2 = newPlayer2;

// Changer le statut
qf3.status = 'ready';

// Ajouter des scores après le match
qf3.score1 = 5;
qf3.score2 = 3;
qf3.winner = newPlayer1;
qf3.status = 'completed';
```

## Exemple complet : Inspection durant le tournoi

```javascript
// Pendant le tournoi, voir l'état de toutes les rooms
tournament.allTournamentRooms.forEach(room => {
  console.log(`
    ${room.roomName} (${room.status})
    Players: ${room.player1?._name || 'TBD'} vs ${room.player2?._name || 'TBD'}
    Score: ${room.score1 || '-'} - ${room.score2 || '-'}
    Winner: ${room.winner?._name || 'TBD'}
  `);
});
```

### Exemple de sortie :
```
Quarter Final 1 (completed)
Players: Alice vs Bob
Score: 5 - 3
Winner: Alice

Quarter Final 2 (completed)
Players: Charlie vs David
Score: 4 - 5
Winner: David

Quarter Final 3 (ready)
Players: Eve vs Frank
Score: - - -
Winner: TBD

Quarter Final 4 (waiting)
Players: TBD vs TBD
Score: - - -
Winner: TBD

Semi Final 1 (waiting)
Players: TBD vs TBD
Score: - - -
Winner: TBD

Semi Final 2 (waiting)
Players: TBD vs TBD
Score: - - -
Winner: TBD

Final (waiting)
Players: TBD vs TBD
Score: - - -
Winner: TBD
```

## Architecture du bracket

```
Quarter Finals (4 matches)
├── QF1: Player1 vs Player2 → Winner1
├── QF2: Player3 vs Player4 → Winner2
├── QF3: Player5 vs Player6 → Winner3
└── QF4: Player7 vs Player8 → Winner4
         ↓
Semi Finals (2 matches)
├── SF1: Winner1 vs Winner2 → SemiWinner1
└── SF2: Winner3 vs Winner4 → SemiWinner2
         ↓
Final (1 match)
└── Final: SemiWinner1 vs SemiWinner2 → 🏆 Champion
```

## Avantages de ce système

✅ **Toutes les rooms existent dès le début** - Pas besoin de les créer à la volée  
✅ **IDs prévisibles** - Format : `{tournamentId}_{round}_{number}`  
✅ **Facile à modifier** - Accès direct via `allTournamentRooms[]`  
✅ **État centralisé** - Tout est dans un seul tableau  
✅ **Tracking complet** - Status, scores, gagnants pour chaque match  

## Notes importantes

- Les rooms sont créées **automatiquement** quand 8 joueurs sont prêts
- Vous pouvez **modifier** `allTournamentRooms[]` pendant le tournoi
- Les **roomIds** suivent le format : `{tournamentId}_quarter_1`, `{tournamentId}_semi_1`, etc.
- Le système utilise ces rooms au lieu d'en créer de nouvelles pendant `tournamentLoop()`
