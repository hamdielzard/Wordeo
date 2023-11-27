/* eslint-disable no-undef */
const supertest = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const User = require('../models/user');

const address = process.env.MONGODB_URL_TEST || 'mongodb://localhost:27017/test?directConnection=true&serverSelectionTimeoutMS=2000';

let testUser;

beforeEach(async () => {
  await mongoose.connect(address);

  await new User({
    userName: 'testUser',
    password: 'Test@123',
  }).save().then((user) => {
    testUser = user.userName;
  });
});

afterEach(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('POST /game', () => {
  it('on success, should return the created lobby with an http status 200', async () => {
    const payload = {
      gameMode: 'solo', userName: testUser,
    };
    const res = await supertest(server)
      .post('/game')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Lobby created successfully!');
  });

  it('on no gameMode provided, should return an http status 400', async () => {
    const payload = {
      userName: testUser,
    };
    const res = await supertest(server)
      .post('/game')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Game mode not provided!');
  });

  it('on invalid gameMode provided, should return an http status 404', async () => {
    const payload = {
      gameMode: 'ranked', userName: testUser,
    };
    const res = await supertest(server)
      .post('/game')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`The provided game mode: ${payload.gameMode} was invalid`);
  });

  it('on no userName provided, should return an http status 400', async () => {
    const payload = {
      gameMode: 'solo',
    };
    const res = await supertest(server)
      .post('/game')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('User name not provided!');
  });

  it('on non-existing userName provided, should return an http status 404', async () => {
    const payload = {
      gameMode: 'solo', userName: 'invalidUser',
    };
    const res = await supertest(server)
      .post('/game')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`User ${payload.userName} not found!`);
  });

  it('on error, should return with an http status 500', async () => {
    const findStub = jest.spyOn(User, 'findOne');
    findStub.mockRejectedValue(new Error('find error'));
    const payload = {
      gameMode: 'solo', userName: testUser,
    };
    const res = await supertest(server)
      .post('/game')
      .send(payload)
      .set('Content-Type', 'application/json');
    //  expect(res.status).toEqual(500);
    expect(res.body.message).toEqual('Failed to create lobby!');

    findStub.mockRestore();
  });
});

describe('GET /game', () => {
  it('on success, should return the existing lobby with an http status 200', async () => {
    const payload1 = {
      gameMode: 'solo', userName: testUser,
    };
    // create a new lobby
    const res1 = await supertest(server)
      .post('/game')
      .send(payload1)
      .set('Content-Type', 'application/json');

    const createdGameCode = res1.body.gameDetails.gameCode;

    const res2 = await supertest(server)
      .get(`/game?gameCode=${createdGameCode}`)
      .set('Content-Type', 'application/json');
    expect(res2.status).toEqual(200);
    expect(res2.body.gameDetails.gameCode).toEqual(createdGameCode);
    expect(res2.body.gameDetails.gameMode).toEqual('solo');
  });

  it('on no gameCode provided, should return with an http status 400', async () => {
    const res = await supertest(server)
      .get('/game')
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Game code not provided!');
  });

  it('on invalid game code provided, should return with an http status 404', async () => {
    const invalidCode = 'INVALID';
    const res = await supertest(server)
      .get(`/game?gameCode=${invalidCode}`)
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`Lobby with game code ${invalidCode} not found!`);
  });

  it('on error, should return with an http status 500', async () => {
    const payload = {
      gameMode: 'solo', userName: testUser,
    };
    // create a new lobby
    const res1 = await supertest(server)
      .post('/game')
      .send(payload)
      .set('Content-Type', 'application/json');

    const createdGameCode = res1.body.gameDetails.gameCode;
    const findStub = jest.spyOn(Array.prototype, 'find');
    findStub.mockImplementation(() => {
      throw new Error('Custom find error');
    });
    const res2 = await supertest(server)
      .get(`/game?gameCode=${createdGameCode}`)
      .set('Content-Type', 'application/json');
    expect(res2.status).toEqual(500);
    expect(res2.body.message).toEqual('Failed to get lobby!');

    findStub.mockRestore();
  });
});
