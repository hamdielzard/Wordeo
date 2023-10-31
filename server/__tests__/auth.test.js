const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');
const server = require("../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require('../models/user');
require("dotenv").config();

const address = process.env.MONGODB_URL_TEST || `mongodb://localhost:27017/test?directConnection=true&serverSelectionTimeoutMS=2000`;

beforeEach(async () => {
    await mongoose.connect(address);
});

afterEach(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('POST /auth/register', () => {
    it('Register new user', async () => {
        const userName = uuidv4(); // Generate a unique userName
        const payload = {
            "userName": userName,
            "password": "Test@123"
        }

        const res = await supertest(server)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

        expect(res.status).toEqual(200);
        expect(res.body.message).toEqual("User registered successfully!");
    });
    
    it('Register with blank username', async () => {
        const userName = uuidv4(); // Generate a unique userName
        const payload = {
            "userName": undefined,
            "password": "undefined"
        }

        const res = await supertest(server)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Invalid username!");
    });
    
    it('Register with blank password', async () => {
        const userName = uuidv4(); // Generate a unique userName
        const payload = {
            "userName": "undefined",
            "password": undefined
        }

        const res = await supertest(server)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Invalid password!");
    });

    it('Registration should fail for a duplicate user', async () => {
        const userName = uuidv4(); // Generate a unique userName
        const payload = {
            "userName": userName,
            "password": "Test@123"
        }

        const res = await supertest(server)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

        const res2 = await supertest(server)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

        expect(res.status).toEqual(200);
        expect(res.body.message).toEqual("User registered successfully!");
        expect(res2.status).toEqual(409);
        expect(res2.body.message).toEqual("User already exists!");
    });
});

describe('POST /auth/login', () => {
    it('Login with blank username', async () => {
        const userName = uuidv4(); // Generate a unique userName
        const payload = {
            "userName": undefined,
            "password": "Test@123"
        }

        const loginResponse = await supertest(server)
            .post('/api/login')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

        expect(loginResponse.status).toEqual(404);
        expect(loginResponse.body.message).toEqual("No such user found!");
    });
    
    it('Login with blank password', async () => {
        const userName = uuidv4(); // Generate a unique userName
        const payload = {
            "userName": userName,
            "password": undefined
        }

        const loginResponse = await supertest(server)
            .post('/api/login')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

        expect(loginResponse.status).toEqual(404);
        expect(loginResponse.body.message).toEqual("No such user found!");
    });
    
    it('Login with blanks', async () => {
        const userName = uuidv4(); // Generate a unique userName
        const payload = {
            "userName": undefined,
            "password": undefined
        }

        const loginResponse = await supertest(server)
            .post('/api/login')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

        expect(loginResponse.status).toEqual(404);
        expect(loginResponse.body.message).toEqual("No such user found!");
    });
    
    it('Login correctly', async () => {
        const userName = uuidv4(); // Generate a unique userName
        const payload = {
            "userName": userName,
            "password": "Test@123"
        }

        const registrationResponse = await supertest(server)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

        const loginResponse = await supertest(server)
            .post('/api/login')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

        expect(registrationResponse.status).toEqual(200);
        expect(loginResponse.status).toEqual(200);
        expect(loginResponse.body.message).toEqual("Login successful!");
    });

    it('Incorrect password', async () => {
        const userName = uuidv4(); // Generate a unique userName
        const registrationPayload = {
            "userName": userName,
            "password": "Test@123"
        };

        const loginPayload = {
            "userName": userName,
            "password": "invalidPassword"
        };

        const registrationResponse = await supertest(server)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(registrationPayload);

        const loginResponse = await supertest(server)
            .post('/api/login')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(loginPayload);

        expect(registrationResponse.status).toEqual(200);
        expect(loginResponse.status).toEqual(400);
        expect(loginResponse.body.message).toEqual("Password does not match!");
    });
});