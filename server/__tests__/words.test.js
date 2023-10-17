const server = require("../server");
const Word = require("../models/words");
const supertest = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const address = process.env.MONGODB_URL_TEST || `mongodb://localhost:27017/test?directConnection=true&serverSelectionTimeoutMS=2000`;

beforeEach(async () => {
    await mongoose.connect(address);

    // seed some fake data
    const testWord = new Word({ word: "test", hints: ["test1", "test2"], category: "testing", difficulty: 0 });
    await testWord.save();
});

afterEach(async () => {
    if (mongoose.connection.readyState) {
        // delete all data from the words collection
        await Word.deleteMany({});
        await mongoose.connection.close();
    }
});

// create a single word
describe('POST /words/word', () => {
    it('on success, should return the created result with an http status 200', async () => {
        const payload = { word: "my word", hints: ["hint1", "hint2"], category: "word", difficulty: 0 };
        const res = await supertest(server)
            .post('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body.word).toEqual(payload.word);
    });

    it('on failure due to a wrong request, should return an http status 400', async () => {
        const payload = { word: "my word", hints: ["hint1", "hint2"] };
        const res = await supertest(server)
            .post('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
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

    it('on word not matched, should return an empty json', async () => {
        const payload = { word: "no word" };
        const res = await supertest(server)
            .get('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(0);
    });

    it('on failure due to a database error, should return an http status 500', async () => {
        // close db connection to test bad path
        await mongoose.connection.close();
        const payload = { word: "no word" };
        const res = await supertest(server)
            .get('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(500);
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

    it('on failure due to a database error, should return an http status 500', async () => {
        // close db connection to test bad path
        await mongoose.connection.close();
        const payload = { word: "test", hint: "test1", newHints: ["1", "2", "3"] };
        const res = await supertest(server)
            .patch('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(500);
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

    it('on failure due to a database error, should return an http status 500', async () => {
        // close db connection to test bad path
        await mongoose.connection.close();
        const payload = { word: "no word", hint: "test1" };
        const res = await supertest(server)
            .delete('/words/word')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(500);
    });
});

// create a multiple words
describe('POST /words', () => {
    it('on success, should return the created result with an http status 200', async () => {
        const payload = {
            words: [
                { word: "my word1", hints: ["hint1", "hint2"], category: "word", difficulty: 0 },
                { word: "my word2", hints: ["hint3", "hint4"], category: "word", difficulty: 0 }
            ]
        };
        const res = await supertest(server)
            .post('/words')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(2);
    });

    it('on failure due to a bad request, should return an http status 400', async () => {
        const payload = {
            words: [
                { word: "my word1", hints: ["hint1", "hint2"], category: "word" },
                { word: "my word2", hints: ["hint3", "hint4"], category: "word" }
            ]
        };
        const res = await supertest(server)
            .post('/words')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(400);
    });
});

// get all words
describe('GET /words', () => {
    it('should return the list of all words', async () => {
        // add a new word
        const newWord = new Word({ word: "new word", hints: ["test1", "test2"], category: "testing", difficulty: 0 });
        await newWord.save();
        const res = await supertest(server)
            .get('/words');
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(2);
    });

    it('should filter by the category when given a query parameter', async () => {
        // add a new word with a different category
        const newWord = new Word({ word: "new word", hints: ["test1", "test2"], category: "another", difficulty: 0 });
        await newWord.save();
        const res = await supertest(server)
            .get('/words?category=another');
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

    it('should filter by the difficulty when given a query parameter', async () => {
        // add another word with a different difficulty
        const newWord = new Word({ word: "new word", hints: ["test1", "test2"], category: "testing", difficulty: 1 });
        await newWord.save();
        const res = await supertest(server)
            .get('/words?difficulty=1');
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

    it('should limit the number of data when given a query parameter', async () => {
        // add a new word
        const newWord = new Word({ word: "new word", hints: ["test1", "test2"], category: "testing", difficulty: 0 });
        await newWord.save();
        const res = await supertest(server)
            .get('/words?count=1');
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

    it('on failure due to a database error, should return an http status 500', async () => {
        // close db connection to test bad path
        await mongoose.connection.close();
        const res = await supertest(server)
            .get('/words');
        expect(res.status).toEqual(500);
    });
});