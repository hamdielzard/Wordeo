const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');
const app = require("../app")
const supertest = require("supertest");
require("dotenv").config();

var newUser = uuidv4();

describe('test version', () => {
    it('should return the version information', async () => {
        const res = await supertest(app).get('/');
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({"version": "V1"});
    });
});

describe('Test Registration', () => {
    it('Should register a new user', async () => {
        const payload = {
            "userName": newUser,
            "password": "Test@123"
        }

        const res = await supertest(app)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

            expect(res.status).toEqual(200);
            expect(res.body.message).toEqual("User Added Successfully!");
    });

    it('Registration should fail for a duplicate user', async () => {
        const payload = {
            "userName": newUser,
            "password": "Test@123"
        }

        const res = await supertest(app)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

            expect(res.status).toEqual(200);
            expect(res.body.message).toEqual("User already exists!");
    });
});

describe('Test Login', () => {
    it('Should login using a proper authentication', async () => {
        const payload = {
            "userName": newUser,
            "password": "Test@123"
        }

        const res = await supertest(app)
            .post('/api/login')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

            expect(res.status).toEqual(200);
            expect(res.body.message).toEqual("Login successful!");
    });

    it('Login should fail with improper password', async () => {
        const payload = {
            "userName": newUser,
            "password": "invalidPassword"
        }

        const res = await supertest(app)
            .post('/api/login')
            .set('Content-Type', 'application/json')
            .set('Accept', '*/*')
            .send(payload);

            expect(res.status).toEqual(200);
            expect(res.body.message).toEqual("Password does not match!");
    });
});