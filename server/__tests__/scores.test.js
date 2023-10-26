const server = require("../server");
const { Score, Modes } = require("../models/scores");
const User = require("../models/user");
const supertest = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const address = process.env.MONGODB_URL_TEST || `mongodb://localhost:27017/test?directConnection=true&serverSelectionTimeoutMS=2000`;

var testAccountID;

beforeEach(async () => {
    await mongoose.connect(address);

    // seed some fake data
    await User.deleteMany({});
    const testAccount = new User({ user_id: 'user1', userName: 'test123', password: 'pass' });
    const accountDoc = await testAccount.save();
    testAccountID = accountDoc._id;
    const testScore = new Score({ score: 999, user: testAccountID, gameMode: Modes.Solo });
    await testScore.save();
});

afterEach(async () => {
    if (mongoose.connection.readyState) {
        // delete all populated data
        await Score.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    }
});

describe('POST /scores', () => {
    it('on success, should return the created result with an http status 200', async () => {
        const payload = { score: 111, userID: testAccountID, gameMode: Modes.Solo };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body.score).toEqual(payload.score);
        expect(res.body.user).toEqual(String(payload.userID));
    });

    it('on fail due to a database error, should return an http status 500', async () => {
        const payload = { score: 111, userID: testAccountID, gameMode: Modes.Solo };
        await mongoose.connection.close();
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(500);
    });

    it('on no user matched, should return an http status 404', async () => {
        // delete the existing User
        await User.deleteOne({ _id:  testAccountID});
        const payload = { score: 999, userID: testAccountID, gameMode: Modes.Solo  };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(404);
    });

    it('on an invalid game mode, should return an http status 400', async () => {
        // delete the existing User
        const payload = { score: 999, userID: testAccountID, gameMode: 'yolo'  };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
    });

    it('on an negative score, should return an http status 400', async () => {
        // delete the existing User
        const payload = { score: -50, userID: testAccountID, gameMode: Modes.Solo  };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
    });
});

describe('GET /scores', () => {
    it('should return the list of all words', async () => {
        // add a new score
        const newScore = new Score({ score: 999, user: testAccountID, gameMode: Modes.Solo });
        await newScore.save();
        const res = await supertest(server)
            .get('/scores');
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(2);
    });

    it('should filter by the user id when given a query parameter', async () => {
        // add a new score with a different user
        const testAccount2 = new User({ user_id: 'user2', userName: 'test2', password: 'pass' });
        const accountDoc = await testAccount2.save();
        const newScore = new Score({ score: 111, user: accountDoc._id, gameMode: Modes.Solo });
        await newScore.save();
        const res = await supertest(server)
            .get(`/scores?userID=${ accountDoc._id }`);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

    it('should filter by the game mode when given a query parameter', async () => {
        // add a new score with a different user
        const newScore = new Score({ score: 111, user: testAccountID, gameMode: Modes.Multi });
        await newScore.save();
        const res = await supertest(server)
            .get(`/scores?gameMode=${ Modes.Multi }`);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

    it('should limit the number of data when given a query parameter', async () => {
        // add a new score
        const newScore = new Score({ score: 999, user: testAccountID, gameMode: Modes.Solo });
        await newScore.save();
        const res = await supertest(server)
            .get('/scores?count=1');
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

    it('on failure due to a database error, should return an http status 500', async () => {
        // close db connection to test bad path
        await mongoose.connection.close();
        const res = await supertest(server)
            .get('/scores');
        expect(res.status).toEqual(500);
    });
});

describe('GET /scores/leaderboard', () => {
    it('should return the list of highscores for a given game mode', async () => {
        // add a new score
        const newScore = new Score({ score: 111, user: testAccountID, gameMode: Modes.Solo });
        await newScore.save();
        const res = await supertest(server)
            .get(`/scores/leaderboard?gameMode=${Modes.Solo}`);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(1); // should only return the highest score
    });

    it('on failure due to a database error, should return an http status 500', async () => {
        // close db connection to test bad path
        await mongoose.connection.close();
        const res = await supertest(server)
            .get('/scores/leaderboard');
        expect(res.status).toEqual(500);
    });
});