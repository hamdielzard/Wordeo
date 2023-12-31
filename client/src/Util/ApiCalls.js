const baseUrl = 'http://localhost:8080';

async function postScore(gameMode, userName, score) {
  const payload = {
    gameMode,
    userName,
    score,
  };

  await fetch(`${baseUrl}/scores`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

async function patchCoins(userName, quantity) {
  const payload = {
    userName,
    quantity,
  };

  await fetch(`${baseUrl}/user/coin`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

async function patchStatistics(userName, wordsGuessed) {
  const payload = {
    userName,
    wordsGuessed,
  };

  await fetch(`${baseUrl}/user/stats`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export {
  postScore,
  patchCoins,
  patchStatistics,
};
