const request = require('supertest')
const { app } = require('../server')
const dbHandler = require('./test-db-setup')
const User = require('../models/User')

beforeAll(async () => await dbHandler.connect())
// beforeEach(async () => await dbHandler.clearDatabase())
afterAll(async () => await dbHandler.closeDatabase())

const userOne = {
    name: 'Ethan',
    email: 'ethan@gmail.com',
    password: '123123',
}

describe('Only authenicated users can access protected routes', () => {
    describe('Contacts route is protected', () => {
        let user
        let contactsUrl
        const baseUrl = '/api/v1/contacts'
        beforeAll(async () => {
            await User.create(userOne)
            user = await User.findOne({email: userOne.email})
            contactsUrl =baseUrl + `/${user.id}/contacts`
        })
        describe('Fail to access', () => {
            test('Cannot access with empty token' , async ()=> {
                const response = await request(app)
                    .get(contactsUrl)
                    .expect(401) 
                expect(response.body.error).toBe('Not authorize to access this route : empty token')
            })
            test('Cannot access with invalid token in header' , async ()=> {
           
                const response = await request(app)
                    .get(contactsUrl)
                    .set({'authorization':'Bearer lalala'})
                    .expect(401)
                expect(response.body.error).toBe('Not authorize for this route : invalid token')
            }) 
            test('Cannot access with invalid token in cookie' , async ()=> {
                const response = await request(app)
                    .get(contactsUrl)
                    .set('Cookie',['token=werer'])
                    .expect(401)
            }) 
        })
        describe('Access success', () => {
            const logInUrl = '/api/v1/users/login'
            let token
            beforeAll(async ()=> {
                let response = await request(app)
                    .post(logInUrl)
                    .send(userOne)
                    .expect(200)
                token = response.body.token
            })
            test('Can access with valid token in header', async ()=> {
                response = await request(app)
                    .get(contactsUrl)
                    .set({'authorization':`Bearer ${token}`})
                    .expect(200)
            })  
            test('Can access with valid token in cookie', async ()=> {
                response = await request(app)
                    .get(contactsUrl)
                    .set('Cookie',[`token=${token}`])
                    .expect(200)
            })  
        })

    }) 
})