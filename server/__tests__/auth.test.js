/* eslint-disable no-undef */
const {
  v4: uuidv4,
} = require('uuid');
const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const server = require('../server');
require('dotenv').config();

const address = process.env.MONGODB_URL_TEST || 'mongodb://localhost:27017/test?directConnection=true&serverSelectionTimeoutMS=2000';

beforeEach(async () => {
  await mongoose.connect(address);
});

afterEach(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('POST /auth/register', () => {
  it('Register new user with no display name', async () => {
    const userName = uuidv4(); // Generate a unique userName
    const payload = {
      userName,
      password: 'Test@123',
    };

    const res = await supertest(server)
      .post('/api/register')
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .send(payload);

    expect(res.status).toEqual(200);
    expect(res.body.displayName).toEqual(userName);
    expect(res.body.message).toEqual('User registered successfully!');
  });

  it('Register new user with a display name', async () => {
    const userName = uuidv4(); // Generate a unique userName
    const displayName = 'newUser';
    const payload = {
      userName,
      password: 'Test@123',
      displayName,
    };

    const res = await supertest(server)
      .post('/api/register')
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .send(payload);

    expect(res.status).toEqual(200);
    expect(res.body.displayName).toEqual(displayName);
    expect(res.body.message).toEqual('User registered successfully!');
  });

  it('Register with blank username', async () => {
    const payload = {
      userName: undefined,
      password: 'undefined',
    };

    const res = await supertest(server)
      .post('/api/register')
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .send(payload);

    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Invalid username!');
  });

  it('Register with blank password', async () => {
    const payload = {
      userName: 'undefined',
      password: undefined,
    };

    const res = await supertest(server)
      .post('/api/register')
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .send(payload);

    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Invalid password!');
  });

  it('Registration should fail for a duplicate user', async () => {
    const userName = uuidv4(); // Generate a unique userName
    const payload = {
      userName,
      password: 'Test@123',
    };

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
    expect(res.body.message).toEqual('User registered successfully!');
    expect(res2.status).toEqual(409);
    expect(res2.body.message).toEqual('User already exists!');
  });

  it('On hash error, should return an http 400 response', async () => {
    const userName = uuidv4(); // Generate a unique userName
    const payload = {
      userName,
      password: 'Test@123',
    };

    const hashStub = jest.spyOn(bcrypt, 'hash');
    hashStub.mockImplementation((password, rounds, callback) => {
      // simulate an error by calling the callback with an error
      callback(new Error('Hash error'));
    });

    const res = await supertest(server)
      .post('/api/register')
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .send(payload);

    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Failed to sign up at this time');

    hashStub.mockRestore();
  });

  it('On save error, should return an http 500 response', async () => {
    const userName = uuidv4(); // Generate a unique userName
    const payload = {
      userName,
      password: 'Test@123',
    };

    // Stubbing the User.save to simulate an error during save
    const saveStub = jest.spyOn(User.prototype, 'save');
    saveStub.mockRejectedValue(new Error('Save error'));

    const res = await supertest(server)
      .post('/api/register')
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .send(payload);

    expect(res.status).toEqual(500);
    expect(res.body.message).toEqual('An error occurred!');

    saveStub.mockRestore();
  });
});

describe('POST /auth/login', () => {
  it('Login with blank username', async () => {
    const payload = {
      userName: undefined,
      password: 'Test@123',
    };

    const loginResponse = await supertest(server)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .send(payload);

    expect(loginResponse.status).toEqual(404);
    expect(loginResponse.body.message).toEqual('No such user found!');
  });

  it('Login with blank password', async () => {
    const userName = uuidv4(); // Generate a unique userName
    const payload = {
      userName,
      password: undefined,
    };

    const loginResponse = await supertest(server)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .send(payload);

    expect(loginResponse.status).toEqual(404);
    expect(loginResponse.body.message).toEqual('No such user found!');
  });

  it('Login with blanks', async () => {
    const payload = {
      userName: undefined,
      password: undefined,
    };

    const loginResponse = await supertest(server)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .send(payload);

    expect(loginResponse.status).toEqual(404);
    expect(loginResponse.body.message).toEqual('No such user found!');
  });

  it('Login correctly', async () => {
    const userName = uuidv4(); // Generate a unique userName
    const payload = {
      userName,
      password: 'Test@123',
    };

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
    expect(loginResponse.body.message).toEqual('Login successful!');
  });

  it('Incorrect password', async () => {
    const userName = uuidv4(); // Generate a unique userName
    const registrationPayload = {
      userName,
      password: 'Test@123',
    };

    const loginPayload = {
      userName,
      password: 'invalidPassword',
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
    expect(loginResponse.body.message).toEqual('Password does not match!');
  });

  it('Error during login should return an http 500 response', async () => {
    const userName = 'existingUser';
    const password = 'Test@123';

    const findOneStub = jest.spyOn(User, 'findOne');
    findOneStub.mockResolvedValue({ userName, password: 'hashedPassword', displayName: 'Existing User' });

    const compareStub = jest.spyOn(bcrypt, 'compare');
    compareStub.mockImplementation((pass, hashedPass, callback) => {
      // simulate an error during password comparison
      callback(new Error('Comparison error'));
    });

    const res = await supertest(server)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .send({ userName, password });

    expect(res.status).toEqual(500);
    expect(res.body.message).toEqual('An error occurred!');

    findOneStub.mockRestore();
    compareStub.mockRestore();
  });
});
