const server = require("../server");
const { Score, Modes } = require("../models/scores");
const User = require("../models/user");
const supertest = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const address = process.env.MONGODB_URL_TEST || `mongodb://localhost:27017/test?directConnection=true&serverSelectionTimeoutMS=2000`;

var testAccountName;
var anotherTestAccountName;

beforeEach(async () => {
    await mongoose.connect(address);

    // Seed some fake data
    const testAccount = await new User({ userName: 'test1', password: 'pass' }).save();
    const anotherTestAccount = await new User({ userName: 'test2', password: 'pass' }).save();
    testAccountName = testAccount.userName
    anotherTestAccountName = anotherTestAccount.userName
});

afterEach(async () => {
    await User.deleteMany({});
    await Score.deleteMany({});
    await mongoose.connection.close();
});

describe('POST /scores', () => {
    // Score validation tests

    it('Add negative score', async () => {
        const payload = { score: -111, userName: testAccountName, gameMode: Modes.Solo };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(`The provided score: ${payload.score} is negative and/or zero!`);
    });

    it('Add zero score', async () => {
        const payload = { score: 0, userName: testAccountName, gameMode: Modes.Solo };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(`No score was provided`);
    });

    it('Give non-numerical score', async () => {
        const payload = { score: "hello", userName: testAccountName, gameMode: Modes.Solo };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(`The provided score: ${payload.score} is not a number!`);
    });

    it('Give no score', async () => {
        const payload = { userName: testAccountName, gameMode: Modes.Solo };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(`No score was provided`);
    });

    // Username validation tests

    it('Give no userName', async () => {
        const payload = { score: 95, gameMode: Modes.Solo };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(`No userName was provided`);
    });

    it('Give non-existing userName', async () => {
        const payload = { score: 95, userName: "xxxhhhhgggfff", gameMode: Modes.Solo };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual(`No user with given userName: ${payload.userName} was found`);
    });

    it('Give empty userName', async () => {
        const payload = { score: 95, userName: "", gameMode: Modes.Solo };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(`No userName was provided`);
    });

    it('Give empty gamemode', async () => {
        const payload = { score: 95, userName: testAccountName, gameMode: "" };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(`No gameMode was provided`);
    });

    it('Give no gamemode', async () => {
        const payload = { score: 95, userName: testAccountName };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(`No gameMode was provided`);
    });

    it('Give non-existing gamemode', async () => {
        const payload = { score: 95, userName: testAccountName, gameMode: "xxxhhhdddd" };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual(`The provided game mode: ${payload.gameMode} was invalid`);
    });

    // Success tests
    it('Submit score', async () => {
        const payload = { score: 95, userName: testAccountName, gameMode: "multi" };
        const res = await supertest(server)
            .post('/scores')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body.message).toEqual(`Score was added successfully!`);
        expect(res.body.score).toEqual(payload.score);
        expect(res.body.userName).toEqual(testAccountName);
        expect(res.body.gameMode).toEqual(payload.gameMode);
    });

});

describe('GET /scores', () => {
    it('Get score', async () => {
        const newScore = new Score({ score: 999, userName: testAccountName, gameMode: Modes.Solo });
        await newScore.save();
        const res = await supertest(server)
            .get('/scores');
        expect(res.status).toEqual(200);
        expect(res.body.response).toHaveLength(1);
    });

    it('Get 5 scores with 10', async () => {
        await new Score({ score: 999, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 724, userName: testAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 152, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 365, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 421, userName: testAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 241, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 957, userName: testAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 324, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 170, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 1420, userName: testAccountName, gameMode: Modes.Solo }).save();
        const res = await supertest(server)
            .get(`/scores?count=5`)
        expect(res.status).toEqual(200);
        expect(res.body.response).toHaveLength(5);
    });
    
    it('Get 10 scores by default', async () => {
        await new Score({ score: 999, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 724, userName: testAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 152, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 365, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 421, userName: testAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 241, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 957, userName: testAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 324, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 170, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 1420, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 1420, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 1420, userName: testAccountName, gameMode: Modes.Solo }).save();
        const res = await supertest(server)
            .get('/scores')
        expect(res.status).toEqual(200);
        expect(res.body.response).toHaveLength(10);
    });

    it('Get gamemode filtered scores', async () => {
        await new Score({ score: 999, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 724, userName: testAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 152, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 365, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 421, userName: testAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 241, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 957, userName: testAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 324, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 170, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 1420, userName: testAccountName, gameMode: Modes.Solo }).save();
        const res = await supertest(server)
            .get(`/scores?gameMode=${Modes.Multi}`)
        expect(res.status).toEqual(200);
        expect(res.body.response).toHaveLength(3);

        const resA = await supertest(server)
            .get(`/scores?gameMode=${Modes.Solo}`)
        expect(resA.status).toEqual(200);
        expect(resA.body.response).toHaveLength(7);
    });

    it('Get username filtered scores', async () => {
        await new Score({ score: 999, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 724, userName: anotherTestAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 152, userName: anotherTestAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 365, userName: anotherTestAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 421, userName: anotherTestAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 241, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 957, userName: testAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 324, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 170, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 1420, userName: testAccountName, gameMode: Modes.Solo }).save();
        const res = await supertest(server)
            .get(`/scores?userName=${testAccountName}`)
        expect(res.status).toEqual(200);
        expect(res.body.response).toHaveLength(6);
        
        const resA = await supertest(server)
            .get(`/scores?userName=${anotherTestAccountName}`)
        expect(resA.status).toEqual(200);
        expect(resA.body.response).toHaveLength(4);
    });

    it('Check sorting', async () => {
        await new Score({ score: 999, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 724, userName: anotherTestAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 152, userName: anotherTestAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 365, userName: anotherTestAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 421, userName: anotherTestAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 241, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 957, userName: testAccountName, gameMode: Modes.Multi }).save();
        await new Score({ score: 324, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 170, userName: testAccountName, gameMode: Modes.Solo }).save();
        await new Score({ score: 1420, userName: testAccountName, gameMode: Modes.Solo }).save();
        const res = await supertest(server)
            .get(`/scores?userName=${testAccountName}`)
        
        expect(res.status).toEqual(200);
        for (let i = 0; i < res.body.response.length; i++) {
            const element = res.body.response[i];
            if (i > 0) {
                expect(element.score).toBeLessThanOrEqual(res.body.response[i - 1].score);
            }
        }

        const resA = await supertest(server)
            .get('/scores')
            .send({ userName: anotherTestAccountName });
        expect(resA.status).toEqual(200);
        for (let i = 0; i < resA.body.response.length; i++) {
            const element = resA.body.response[i];
            if (i > 0) {
                expect(element.score).toBeLessThanOrEqual(resA.body.response[i - 1].score);
            }
        }
    });
});

