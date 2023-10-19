const server = require("../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const address = process.env.MONGODB_URL_TEST || `mongodb://localhost:27017/test?directConnection=true&serverSelectionTimeoutMS=2000`;

beforeEach(async () => {
    await mongoose.connect(address);
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe('test version', () => {
    it('should return the version information', async () => {
        const res = await supertest(server).get('/');
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ "version": "V1" });
    });
});