/* eslint-disable no-undef */
const supertest = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const User = require('../models/user');
require('dotenv').config();

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

describe('GET /user', () => {
  it('Get all users', async () => {
    const res = await supertest(server)
      .get('/user');

    expect(res.status).toEqual(200);
    expect(res.body.response).toHaveLength(1);
  });

  it('Get no users', async () => {
    await User.deleteMany({});
    const res = await supertest(server)
      .get('/user');

    expect(res.status).toEqual(200);
    expect(res.body.response).toHaveLength(0);
  });

  it('Get single user', async () => {
    const res = await supertest(server)
      .get(`/user?userName=${testUser}`);

    expect(res.status).toEqual(200);
    expect(res.body.response.userName).toEqual(testUser);
    expect(res.body.response.displayName).toEqual(undefined);
    expect(res.body.response.description).toEqual(undefined);
  });

  it('Get non-existing user', async () => {
    const payload = {
      userName: 'NonExistingUser',
    };

    const res = await supertest(server)
      .get(`/user?userName=${payload.userName}`);

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`User ${payload.userName} not found!`);
  });

  it('should return a 500 response if an error occurs during user retrieval', async () => {
    jest.spyOn(User, 'find').mockRejectedValue(new Error('Simulated error'));

    const res = await supertest(server).get('/user');

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Failed to get all users!');

    User.find.mockRestore();
  });

  it('should return a 500 response if an error occurs during user retrieval', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Simulated error'));

    const res = await supertest(server)
      .get(`/user?userName=${testUser}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Failed to get user!');

    User.findOne.mockRestore();
  });
});

describe('PATCH /user', () => {
  it('Non-existing user', async () => {
    const payload = {
      userName: 'xxxgggghhhh',
      displayName: 'llllll',
      description: '',
    };

    const res = await supertest(server)
      .patch('/user')
      .send(payload);

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`User ${payload.userName} not found!`);
  });

  it('No userName given', async () => {
    const payload = {
      displayName: '',
      description: '',
    };

    const res = await supertest(server)
      .patch('/user')
      .send(payload);

    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Bad request! userName is required!');
  });

  it('Empty displayName', async () => {
    const payload = {
      userName: testUser,
      displayName: '',
      description: '',
    };

    const res = await supertest(server)
      .patch('/user')
      .send(payload);

    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Bad request! displayName is required!');
  });

  it('Empty description', async () => {
    const payload = {
      userName: testUser,
      displayName: 'CoolName',
      description: '',
    };

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
      userName: testUser,
      displayName: 'CoolName',
      description: 'Test Description',
    };

    const res = await supertest(server)
      .patch('/user')
      .send(payload);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual(`User ${payload.userName} updated successfully!`);
    expect(res.body.displayName).toEqual(payload.displayName);
    expect(res.body.description).toEqual(payload.description);

    // Check it has updated with GET
    const res2 = await supertest(server)
      .get(`/user?userName=${testUser}`);
    expect(res2.status).toEqual(200);
    expect(res2.body.response.userName).toEqual(testUser);
    expect(res2.body.response.displayName).toEqual(payload.displayName);
    expect(res2.body.response.description).toEqual(payload.description);
  });

  it('should return a 500 response if an error occurs during user retrieval', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Simulated error'));

    const payload = {
      userName: testUser,
      displayName: 'CoolName',
      description: 'Test Description',
    };

    const res = await supertest(server)
      .patch('/user')
      .send(payload);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('An error occurred while updating the user!');

    User.findOne.mockRestore();
  });
});

describe('DELETE /user', () => {
  it('No userName given', async () => {
    const res = await supertest(server)
      .delete('/user');

    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Bad request! userName is required!');
  });

  it('Non existing user', async () => {
    const payload = {
      userName: 'NonExistingUser',
    };

    const res = await supertest(server)
      .delete('/user')
      .send(payload);

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`User ${payload.userName} not found!`);
  });

  it('Delete user', async () => {
    const payload = {
      userName: testUser,
    };

    const res = await supertest(server)
      .delete('/user')
      .send(payload);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual(`User ${payload.userName} was deleted successfully!`);
  });

  it('should return a 500 response if an error occurs during user search', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('find error'));

    const response = await supertest(server)
      .delete('/user')
      .send({ userName: testUser });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to find user!');

    User.findOne.mockRestore();
  });

  it('should return a 500 response if an error occurs during user deletion', async () => {
    jest.spyOn(User, 'findOneAndDelete').mockRejectedValue(new Error('find and delete error'));

    const response = await supertest(server)
      .delete('/user')
      .send({ userName: testUser });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to delete user!');

    User.findOneAndDelete.mockRestore();
  });
});

describe('PATCH /user/inventory', () => {
  it('If an empty body was provided, should return an http 400 response', async () => {
    const res = await supertest(server)
      .patch('/user/inventory')
      .send({});

    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual('Please provide userName, itemName, and quantity in the request body.');
  });

  it('should update the inventory for an existing user and existing item', async () => {
    const payload = {
      userName: testUser,
      itemName: 'Item A',
      quantity: 2,
    };

    const res1 = await supertest(server)
      .patch('/user/inventory')
      .send(payload);

    expect(res1.status).toBe(200);
    expect(res1.body.message).toBe('Inventory updated successfully');
    expect(res1.body.user.inventory).toHaveLength(1);
    expect(res1.body.user.inventory[0].name).toBe('Item A');
    expect(res1.body.user.inventory[0].quantity).toBe(2);

    // check if item quantity is correct on multiple updates
    const res2 = await supertest(server)
      .patch('/user/inventory')
      .send(payload);

    expect(res2.status).toBe(200);
    expect(res2.body.message).toBe('Inventory updated successfully');
    expect(res2.body.user.inventory).toHaveLength(1);
    expect(res2.body.user.inventory[0].name).toBe('Item A');
    expect(res2.body.user.inventory[0].quantity).toBe(4);
  });

  it('should return an http 404 if no user was found', async () => {
    const userName = 'nonExistingUser';
    const payload = {
      userName,
      itemName: 'Item A',
      quantity: 2,
    };

    const response = await supertest(server)
      .patch('/user/inventory')
      .send(payload);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`User ${userName} not found!`);
  });

  it('should return a 500 response if an error occurs during inventory update', async () => {
    jest.spyOn(User.prototype, 'save').mockRejectedValue(new Error('save error'));

    const payload = {
      userName: testUser,
      itemName: 'item',
      quantity: 1,
    };

    const response = await supertest(server)
      .patch('/user/inventory')
      .send(payload);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to update inventory!');

    User.prototype.save.mockRestore();
  });
});

describe('PATCH /user/coin', () => {
  it('should add coins to the user balance for a positive quantity', async () => {
    const payload = {
      userName: testUser,
      quantity: 50,
    };

    const res1 = await supertest(server)
      .patch('/user/coin')
      .send(payload);

    expect(res1.status).toBe(200);
    expect(res1.body.message).toBe('Coins updated successfully');
    expect(res1.body.user.coins).toBe(50);

    // check if update is properly done on multiple calls
    const res2 = await supertest(server)
      .patch('/user/coin')
      .send(payload);

    expect(res2.status).toBe(200);
    expect(res2.body.message).toBe('Coins updated successfully');
    expect(res2.body.user.coins).toBe(100);
  });

  it('should deduct coins from the user balance for a negative quantity if the user has enough balance', async () => {
    const addPayload = {
      userName: testUser,
      quantity: 50,
    };

    const subPayload = {
      userName: testUser,
      quantity: -50,
    };

    const res1 = await supertest(server)
      .patch('/user/coin')
      .send(addPayload);

    const res2 = await supertest(server)
      .patch('/user/coin')
      .send(subPayload);

    expect(res1.status).toBe(200);
    expect(res1.body.message).toBe('Coins updated successfully');
    expect(res1.body.user.coins).toBe(50);

    expect(res2.status).toBe(200);
    expect(res2.body.message).toBe('Coins updated successfully');
    expect(res2.body.user.coins).toBe(0);
  });

  it('should return a 400 response for a negative quantity if the user has insufficient balance', async () => {
    const addPayload = {
      userName: testUser,
      quantity: 50,
    };

    const subPayload = {
      userName: testUser,
      quantity: -150,
    };

    const res1 = await supertest(server)
      .patch('/user/coin')
      .send(addPayload);

    const res2 = await supertest(server)
      .patch('/user/coin')
      .send(subPayload);

    expect(res1.status).toBe(200);
    expect(res1.body.message).toBe('Coins updated successfully');
    expect(res1.body.user.coins).toBe(50);

    expect(res2.status).toBe(400);
    expect(res2.body.message).toBe('Insufficient balance to deduct coins.');
  });

  it('should return a 404 response for a non-existing user', async () => {
    const payload = {
      userName: 'nonExistingUser',
      quantity: 50,
    };

    const response = await supertest(server)
      .patch('/user/coin')
      .send(payload);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`User ${payload.userName} not found!`);
  });

  const invalidPayloads = [
    { quantity: 50 }, // Missing userName
    { userName: 'existingUser' }, // Missing quantity
    { userName: 'existingUser', quantity: 'invalid' }, // Invalid quantity
  ];
  test.each(invalidPayloads)('should return a 400 response for missing or invalid fields in the request body', async (payload) => {
    const response = await supertest(server)
      .patch('/user/coin')
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Please provide userName and a valid quantity in the request body.');
  });

  it('should return a 500 response if an error occurs during coins update', async () => {
    jest.spyOn(User.prototype, 'save').mockRejectedValue(new Error('save error'));

    const payload = {
      userName: testUser,
      quantity: 50,
    };

    const response = await supertest(server)
      .patch('/user/coin')
      .send(payload);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to update coins!');

    User.prototype.save.mockRestore();
  });
});

describe('GET /user/coin', () => {
  it('should return the user\'s coin balance for an existing user', async () => {
    const response = await supertest(server)
      .get(`/user/coin?userName=${testUser}`);

    expect(response.status).toBe(200);
    expect(response.body.coinBalance).toBe(0);
  });

  it('should return a 404 response for a non-existing user', async () => {
    const userName = 'nonExistingUser';
    const response = await supertest(server)
      .get(`/user/coin?userName=${userName}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`User ${userName} not found!`);
  });

  it('should return a 400 response for missing userName in query parameters', async () => {
    const response = await supertest(server)
      .get('/user/coin');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Please provide a userName in the query parameters.');
  });

  it('should return a 500 response if an error occurs during coin balance retrieval', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('find error'));

    const response = await supertest(server)
      .get('/user/coin')
      .query({ userName: testUser });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to retrieve coin balance!');

    User.findOne.mockRestore();
  });
});
