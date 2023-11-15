const server = require("../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require('../models/user');
const { StoreItem, initialStoreItems, initializeStoreItems } = require('../models/store');
require("dotenv").config();

const address = process.env.MONGODB_URL_TEST || `mongodb://localhost:27017/test?directConnection=true&serverSelectionTimeoutMS=2000`;

var testAccountName;

beforeEach(async () => {
    await mongoose.connect(address);

    // Seed some fake data
    const testAccount = await new User({ userName: 'test1', password: 'pass' }).save();
    testAccountName = testAccount.userName
});

afterEach(async () => {
    await User.deleteMany({});
    await StoreItem.deleteMany({});
    await mongoose.connection.close();
});

describe('GET /store', () => {
    it('Successful retrieval of store items should return an http 200 response', async () => {
        const findStub = jest.spyOn(StoreItem, 'find');
        findStub.mockResolvedValue(['Item A', 'Item B']);

        const res = await supertest(server)
            .get('/store');

        expect(res.status).toEqual(200);
        expect(res.body.storeItems).toEqual(['Item A', 'Item B']);

        expect(findStub).toHaveBeenCalled();

        findStub.mockRestore();
    });

    it('Error during retrieval of store items should return an http 500 response', async () => {
        const findStub = jest.spyOn(StoreItem, 'find');
        findStub.mockRejectedValue(new Error('Database error'));

        const res = await supertest(server)
            .get('/store');

        expect(res.status).toEqual(500);
        expect(res.body.message).toEqual('Failed to retrieve store items!');

        expect(findStub).toHaveBeenCalled();

        findStub.mockRestore();
    });
});

describe('POST /store', () => {
    it('Successful purchase should return an http 200 response', async () => {
        const itemA = new StoreItem({ name: 'Item A', description: 'Add 5 seconds to the timer', category: 'powerup', price: 500, enabled: false });
        const findOneStoreItemStub = jest.spyOn(StoreItem, 'findOne');
        findOneStoreItemStub.mockResolvedValue(itemA);

        const res = await supertest(server)
            .post('/store')
            .send({ userName: testAccountName, itemName: 'Item A', quantity: 1 });

        expect(res.status).toEqual(200);
        expect(res.body.message).toEqual('Item Item A purchased successfully');

        findOneStoreItemStub.mockRestore();
    });

    it('If an empty body was provided, should return an http 400 response', async () => {
        const res = await supertest(server)
            .post('/store')
            .send({});

        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual('Please provide userName, itemName, and quantity in the request body.');
    });

    it('On an error during purchase should return an http 500 response', async () => {
        // this will result in a fail since the returned mock is not an instance of "StoreItem"
        const findOneStoreItemStub = jest.spyOn(StoreItem, 'findOne');
        findOneStoreItemStub.mockResolvedValue({ itemName: "Item A" });

        const res = await supertest(server)
            .post('/store')
            .send({ userName: testAccountName, itemName: 'Item A', quantity: 1 });

        expect(res.status).toEqual(500);
        expect(res.body.message).toEqual('Failed to purchase item!');

        findOneStoreItemStub.mockRestore();
    });

    it('User not found should return an http 404 response', async () => {
        // Mocking the scenario where the user is not found
        const findOneUserStub = jest.spyOn(User, 'findOne');
        findOneUserStub.mockResolvedValue(null);

        const res = await supertest(server)
            .post('/store')
            .send({ userName: 'nonexistentUser', itemName: 'Item A', quantity: 1 });

        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual('User nonexistentUser not found!');

        expect(findOneUserStub).toHaveBeenCalled();

        findOneUserStub.mockRestore();
    });

    it('Store item not found should return an http 404 response', async () => {
        // the store item is not found
        const findOneUserStub = jest.spyOn(User, 'findOne');
        findOneUserStub.mockResolvedValue({ userName: 'existingUser', inventory: [] });

        const findOneStoreItemStub = jest.spyOn(StoreItem, 'findOne');
        findOneStoreItemStub.mockResolvedValue(null);

        const res = await supertest(server)
            .post('/store')
            .send({ userName: 'existingUser', itemName: 'nonexistentItem', quantity: 1 });

        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual('Store item nonexistentItem not found!');

        expect(findOneUserStub).toHaveBeenCalled();
        expect(findOneStoreItemStub).toHaveBeenCalled();

        findOneUserStub.mockRestore();
        findOneStoreItemStub.mockRestore();
    });

    it('Already purchased item should return an http 400 response', async () => {
        // Mocking the scenario where the item is already purchased
        const findOneUserStub = jest.spyOn(User, 'findOne');
        findOneUserStub.mockResolvedValue({ userName: 'existingUser', inventory: [] });

        const findOneStoreItemStub = jest.spyOn(StoreItem, 'findOne');
        findOneStoreItemStub.mockResolvedValue({ name: 'Item A', enabled: true }); // Already purchased

        const res = await supertest(server)
            .post('/store')
            .send({ userName: 'existingUser', itemName: 'Item A', quantity: 1 });

        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual('Item Item A is already purchased!');

        expect(findOneUserStub).toHaveBeenCalled();
        expect(findOneStoreItemStub).toHaveBeenCalled();

        findOneUserStub.mockRestore();
        findOneStoreItemStub.mockRestore();
    });

    it('Error during purchase should return an http 500 response', async () => {
        // Mocking an error during the purchase process
        const findOneUserStub = jest.spyOn(User, 'findOne');
        findOneUserStub.mockRejectedValue(new Error('Database error'));

        const res = await supertest(server)
            .post('/store')
            .send({ userName: 'existingUser', itemName: 'Item A', quantity: 1 });

        expect(res.status).toEqual(500);
        expect(res.body.message).toEqual('Failed to find user!');

        expect(findOneUserStub).toHaveBeenCalled();

        findOneUserStub.mockRestore();
    });
});

// from models/store.js
describe('initializeStoreItems', () => {
    it('should initialize store items if none exist in the database', async () => {
        await initializeStoreItems();

        const storeItems = await StoreItem.find();
        expect(storeItems.length).toBe(initialStoreItems.length);
    });

    it('should not initialize store items if they already exist in the database', async () => {
        // insert some store items before calling initializeStoreItems
        await StoreItem.insertMany([{ name: 'Item1' }, { name: 'Item2' }]);

        await initializeStoreItems();

        const storeItems = await StoreItem.find();
        expect(storeItems.length).toBe(2);
    });

    it('should log an error if an error occurs during initialization', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(StoreItem, 'insertMany').mockRejectedValue(new Error('insert error'));

        await initializeStoreItems();

        expect(console.error).toHaveBeenCalledWith('Error initializing store items:', expect.any(Error));

        console.error.mockRestore();
        StoreItem.insertMany.mockRestore();
    });
});
