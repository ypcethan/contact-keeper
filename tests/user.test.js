const request = require('supertest')
const { app } = require('../server')
const dbHandler = require('./test-db-setup')
const User = require('../models/User')

// connect to a new in-memory database before running any tests.
beforeAll(async () => await dbHandler.connect())

/**
 * Clear all test data after every test.
 */
beforeEach(async () => await dbHandler.clearDatabase())

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase())

const userOne = {
    name: 'Ethan',
    email: 'ethan@gmail.com',
    password: '123123',
}

const baseUrl = '/api/v1/users'
describe('User', () => {
    describe('Register user', () => {
        const registerUrl = baseUrl + '/register'
        test('Can register a new user', async () => {
            const response = await request(app)
                .post(registerUrl)
                .send(userOne)
                .expect(200)

            const user = await User.findById(response.body.user._id)
            expect(user).not.toBeNull()
        })
        test('Cannot register when user with same email exists', async () => {
            await User.create(userOne)
            const response = await request(app)
                .post(registerUrl)
                .send(userOne)
                .expect(400)
        }),
   
        test('Name is required', async () => {
            const response = await request(app).post(registerUrl).send({
                password: '12341234',
                email: 'qwer@gmail.com',
            })
            expect(response.body).toMatchObject({
                success: false,
                error: 'Please add a name',
            })
        })
        test('Password should be hashed', async () => {
            const response = await request(app)
                .post(registerUrl)
                .send(userOne)
                .expect(200)
            const user = await User.findById(response.body.user._id)
            expect(userOne.password).not.toBe(user.password)
        })
    })

    describe('Sign in user', () => {
        beforeEach(async () => {
            await User.create(userOne)
        })
        const logInUrl = baseUrl + '/login'
        test('Can login with existing account', async () => {
            const response = await request(app)
                .post(logInUrl)
                .send(userOne)
                .expect(200)
            const token = response.body.token
            expect(token).not.toBeNull()
        })
    })
})

