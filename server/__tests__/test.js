const server = require("../server")
const supertest = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const username = process.env.MONGODB_USER
const password = process.env.MONGODB_PASS
const URL = process.env.MONGOURL

const address = `mongodb+srv://${username}:${password}@${URL}/?retryWrites=true&w=majority`
  
beforeEach(async () => {
    await mongoose.connect(address);
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe('test endpoint', () => {
    it('should return the version information', async () => {
        const res = await supertest(server).get('/');
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({"version": "V1"});
    });
});