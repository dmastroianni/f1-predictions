/**
 * Calculate points based on matching positions
 * 1 point per correct position match
 */
export function calculateScores(predictedPositions, actualPositions) {
  if (!predictedPositions || !actualPositions) {
    return 0;
  }

  let points = 0;

  // Compare each position
  for (const position in predictedPositions) {
    const predictedDriver = predictedPositions[position];
    const actualDriver = actualPositions[position];

    if (predictedDriver && actualDriver && predictedDriver === actualDriver) {
      points += 1;
    }
  }

  return points;
}

/**
 * Get detailed breakdown of matches
 */
export function getScoreBreakdown(predictedPositions, actualPositions) {
  const matches = [];
  const misses = [];

  for (const position in predictedPositions) {
    const predictedDriver = predictedPositions[position];
    const actualDriver = actualPositions[position];

    if (predictedDriver && actualDriver) {
      if (predictedDriver === actualDriver) {
        matches.push({
          position: parseInt(position),
          driver: predictedDriver
        });
      } else {
        misses.push({
          position: parseInt(position),
          predicted: predictedDriver,
          actual: actualDriver
        });
      }
    }
  }

  return {
    matches,
    misses,
    totalPoints: matches.length
  };
}

