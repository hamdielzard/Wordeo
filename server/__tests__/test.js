const server = require("../server")
const supertest = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();
  
beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URL_TEST);
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