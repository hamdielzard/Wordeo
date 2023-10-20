import { GAME_MODES } from "./GameModes";

const baseUrl = "http://localhost:8080";

async function fetchWords(count) {
    var words;
    try {
        const response = await fetch(`${baseUrl}/words?count=${count}`);
        const result = await response.json();
        words = result;
    } catch (error) {
        console.log(error);
    }
    return words;
}

async function fetchHighScore(userId) {
    var highscore;
    try {
        const response = await fetch(`scores?userID=${userId}&count=1`);
        const result = await response.json();
        highscore = parseInt(result[0].score);
    } catch (error) {
        console.log(error);
    }
    return highscore;
}

async function postScore(userId, score) {
    const payload = {
        score: score,
        userID: userId,
        gameMode: GAME_MODES.Solo // TODO: update to reflect game mode
    }

    console.log(payload);
   
    await fetch(`${baseUrl}/scores`, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}


export {
    fetchWords,
    postScore
};