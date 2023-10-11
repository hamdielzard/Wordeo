const server = require("../server")
const supertest = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const mongourl = process.env.MONGODB_URL_TEST || process.env.npm_config_mongourl; // fetch from .env or argument (for pipelines)

beforeEach(async () => {
    await mongoose.connect(mongourl);
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