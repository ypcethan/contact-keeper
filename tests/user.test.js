const request = require('supertest')
const { app } = require('../server')
const dbHandler = require("./test-db-setup");
const User = require('../models/User')

// connect to a new in-memory database before running any tests.
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

const userOne = {
    name: "Ethan",
    email: 'ethan@gmail.com',
    password: '123123'
}

const baseUrl = '/api/v1/users'
describe('User', () => {
    test('Can register a new user', async () => {
        const response = await request(app)
            .post(baseUrl + "/register")
            .send(userOne)
            .expect(200)

        const user = await User.findById(response.body.user._id)
        expect(user).not.toBeNull()
    });
    test('Error with duplicate email', async () => {
        await User.create(userOne)
        const response = await request(app)
            .post(baseUrl + "/register")
            .send(userOne)
            .expect(400)
    })
});