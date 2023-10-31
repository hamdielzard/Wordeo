const server = require("../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require('../models/user');
require("dotenv").config();

const address = process.env.MONGODB_URL_TEST || `mongodb://localhost:27017/test?directConnection=true&serverSelectionTimeoutMS=2000`;

let testUser;
let testUser2;
let testUser3;

beforeEach(async () => {
    await mongoose.connect(address);
    
    await new User({
        userName: "testUser",
        password: "Test@123"
    }).save().then((user) => {
        testUser = user.userName;
    });

    await new User({
        userName: "testUser2",
        password: "Test@123"
    }).save().then((user) => {
        testUser2 = user.userName;
    });

    await new User({
        userName: "testUser3",
        password: "Test@123"
    }).save().then((user) => {
        testUser3 = user.userName;
    });
});

afterEach(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('GET /user', () => {
    it('Get all users', async () => {
        const res = await supertest(server)
            .get('/user')

        expect(res.status).toEqual(200);
        expect(res.body.response).toHaveLength(3);
    });

    it('Get no users', async () => {
        await User.deleteMany({});
        const res = await supertest(server)
            .get('/user')

        expect(res.status).toEqual(200);
        expect(res.body.response).toHaveLength(0);
    });

    it('Get single user', async () => {
        const res = await supertest(server)
            .get(`/user?userName=${testUser}`)

        expect(res.status).toEqual(200);
        expect(res.body.response.userName).toEqual(testUser);
        expect(res.body.response.displayName).toEqual(undefined);
        expect(res.body.response.description).toEqual(undefined);
    });
    
    it('Get non-existing user', async () => {
        const payload = {
            "userName": "NonExistingUser"
        }
        
        const res = await supertest(server)
            .get(`/user?userName=${payload.userName}`)

        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual(`User ${payload.userName} not found!`);
    });
});

describe('PATCH /user', () => {
    it('Non-existing user', async () => {
        const payload = {
            "userName": "xxxgggghhhh",
            "displayName": "llllll",
            "description": ""
        }

        const res = await supertest(server)
            .patch('/user')
            .send(payload);

        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual(`User ${payload.userName} not found!`);
    });
    
    it('No userName given', async () => {
        const payload = {
            "displayName": "",
            "description": ""
        }

        const res = await supertest(server)
            .patch('/user')
            .send(payload);

        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(`Bad request! userName is required!`);
    });
    
    it('Empty displayName', async () => {
        const payload = {
            "userName": testUser,
            "displayName": "",
            "description": ""
        }

        const res = await supertest(server)
            .patch('/user')
            .send(payload);

        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(`Bad request! displayName is required!`);
    });
    
    it('Empty description', async () => {
        const payload = {
            "userName": testUser,
            "displayName": "CoolName",
            "description": ""
        }

        const res = await supertest(server)
            .patch('/user')
            .send(payload);

        expect(res.status).toEqual(200);
        expect(res.body.message).toEqual(`User ${payload.userName} updated successfully!`);
        expect(res.body.displayName).toEqual(payload.displayName);
        expect(res.body.description).toEqual(payload.description);
    });

    it('Update user description and displayName', async () => {
        const payload = {
            "userName": testUser,
            "displayName": "CoolName",
            "description": "Test Description"
        }

        const res = await supertest(server)
            .patch('/user')
            .send(payload);

        expect(res.status).toEqual(200);
        expect(res.body.message).toEqual(`User ${payload.userName} updated successfully!`);
        expect(res.body.displayName).toEqual(payload.displayName);
        expect(res.body.description).toEqual(payload.description);
        
        // Check it has updated with GET
        
        const getPayload = {
            "userName": testUser
        }
        
        const res2 = await supertest(server)
            .get(`/user?userName=${getPayload.userName}`)

        expect(res2.status).toEqual(200);
        expect(res2.body.response.userName).toEqual(testUser);
        expect(res2.body.response.displayName).toEqual(payload.displayName);
        expect(res2.body.response.description).toEqual(payload.description);
    });
});

describe('DELETE /user', () => {
    it('No userName given', async () => {
        const res = await supertest(server)
            .delete('/user')

        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(`Bad request! userName is required!`);
    });
    
    it('Non existing user', async () => {
        const payload = {
            "userName": "NonExistingUser"
        }
        
        const res = await supertest(server)
            .delete('/user')
            .send(payload);

        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual(`User ${payload.userName} not found!`);
    });

    it('Delete user', async () => {
        const payload = {
            "userName": testUser
        }
        
        const res = await supertest(server)
            .delete('/user')
            .send(payload);

        expect(res.status).toEqual(200);
        expect(res.body.message).toEqual(`User ${payload.userName} was deleted successfully!`);
    });
});
