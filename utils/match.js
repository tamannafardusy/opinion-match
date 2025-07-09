export function getSimilarity(a, b) {
  const wordsA = a.toLowerCase().split(/\W+/);
  const wordsB = b.toLowerCase().split(/\W+/);
  const common = wordsA.filter(w => wordsB.includes(w));
  return common.length / Math.max(wordsA.length, wordsB.length);
}

export function findBestCluster(userInput, clusters) {
  let best = null, bestScore = 0;

  clusters.forEach(cluster => {
    cluster.examples.forEach(example => {
      const score = getSimilarity(userInput, example);
      if (score > bestScore) {
        bestScore = score;
        best = cluster;
      }
    });
  });

  return best;
}