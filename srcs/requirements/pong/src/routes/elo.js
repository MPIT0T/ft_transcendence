function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

function updateElo(ratingA, ratingB, scoreA, k = 32) {
  const expectedA = expectedScore(ratingA, ratingB);
  const expectedB = expectedScore(ratingB, ratingA);

  const newRatingA = Math.round(ratingA + k * (scoreA - expectedA));
  const newRatingB = Math.round(ratingB + k * ((1 - scoreA) - expectedB));

  return { newRatingA, newRatingB };
}

// Exemple d'utilisation :
let playerA = 1600;
let playerB = 1500;

// A gagne contre B (scoreA = 1)
let result = updateElo(playerA, playerB, 1);

console.log(`Nouveau Elo A: ${result.newRatingA}`);
console.log(`Nouveau Elo B: ${result.newRatingB}`);
