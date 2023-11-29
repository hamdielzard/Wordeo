const baseUrl = 'http://localhost:8080';

async function fetchWords(count) {
  let words;
  try {
    const response = await fetch(`${baseUrl}/words?count=${count}`);
    const result = await response.json();
    words = result;
  } catch (error) {
    console.log(error);
  }
  return words;
}

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

export {
  fetchWords,
  postScore,
  patchCoins,
};
