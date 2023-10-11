const server = require("../server")
const Word = require("../models/words")
const supertest = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const username = process.env.MONGODB_USER
const password = process.env.MONGODB_PASS
const URL = process.env.MONGOURL

const address = `mongodb+srv://${username}:${password}@${URL}/?retryWrites=true&w=majority`

beforeEach(async () => {
    await mongoose.connect(address);

    // seed some fake data
    const testWord = new Word({ word: "test", hints: ["test1", "test2"] });
    await testWord.save();
});

afterEach(async () => {
    // delete all data from the words collection
    await Word.deleteMany({});
    await mongoose.connection.close();
});

// create a single word
describe('POST /words/word', () => {
    it('on success, should return the created result with an http status 200', async () => {
        const payload = { word: "my word", hints: ["hint1", "hint2"] };
        const res = await supertest(server)
            .post('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body.word).toEqual(payload.word);
    });
});

// get a single word
describe('GET /words/word', () => {
    it('on word matched, should return the list of words', async () => {
        const payload = { word: "test" };
        const res = await supertest(server)
            .get('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json')
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

    it('on word not found, should return an empty json', async () => {
        const payload = { word: "no word" };
        const res = await supertest(server)
            .get('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(0);
    });
});

// update a single word
describe('PATCH /words/word', () => {
    it('on word matched, should return 1 modifiedCount with an http status 200', async () => {
        const payload = { word: "test", hint: "test1", newHints: ["1", "2", "3"] };
        const res = await supertest(server)
            .patch('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body.acknowledged).toBe(true);
        expect(res.body.modifiedCount).toBe(1);
    });

    it('on word not found, should return 0 modifiedCount with an http status 200', async () => {
        const payload = { word: "no word", hint: "test1", newHints: ["1", "2", "3"] };
        const res = await supertest(server)
            .patch('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body.acknowledged).toBe(true);
        expect(res.body.modifiedCount).toBe(0);
    });

    it('on wrong request body, should return false acknowledgement with an http status 200', async () => {
        const payload = { word: "no word", hint: "test1" };
        const res = await supertest(server)
            .patch('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body.acknowledged).toBe(false);
    });
});

// delete a single word
describe('DELETE /words/word', () => {
    it('on word matched, should return 1 deletedCount with an http status 200', async () => {
        const payload = { word: "test", hint: "test1" };
        const res = await supertest(server)
            .delete('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body.acknowledged).toBe(true);
        expect(res.body.deletedCount).toBe(1);
    });

    it('on word not found, should return 0 deletedCount with an http status 200', async () => {
        const payload = { word: "no word", hint: "test1" };
        const res = await supertest(server)
            .delete('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body.acknowledged).toBe(true);
        expect(res.body.deletedCount).toBe(0);
    });
});

// create a multiple words
describe('POST /words', () => {
    it('on success, should return the created result with an http status 200', async () => {
        const payload = {
            words: [
                { word: "my word1", hints: ["hint1", "hint2"] },
                { word: "my word2", hints: ["hint3", "hint4"] }
            ]
        };
        const res = await supertest(server)
            .post('/words')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(2);
    });
});

// get a single word
describe('GET /words', () => {
    it('should return the list of all words', async () => {
        const res = await supertest(server)
            .get('/words')
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(1);
    });
});