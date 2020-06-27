const request = require('supertest')
const { app } = require('../server')
const dbHandler = require('./test-db-setup')
const User = require('../models/User')
const Contact = require('../models/Contact')
const {userOneData,userTwoData,contactOneData , contactTwoData,contactThreeData} = require('./fixture/db')

beforeAll(async () => await dbHandler.connect())
// beforeEach(async () => await dbHandler.clearDatabase())
afterAll(async () => await dbHandler.closeDatabase())

const baseUrl = '/api/v1/contacts'
const logInUrl = '/api/v1/users/login'

const createUserAndGenerateToken = async (userData) => {
    const user =  await User.create(userData)
    let response = await request(app)
        .post(logInUrl)
        .send(userData)
        .expect(200)
    const token = response.body.token
    return {user , token}
}

let userOne,userTwo,tokenOne,tokenTwo,contactThree
    
beforeAll(async () => {
    const userOneDoc = await createUserAndGenerateToken(userOneData)
    userOne = userOneDoc.user
    tokenOne = userOneDoc.token

    const userTwoDoc = await createUserAndGenerateToken(userTwoData)
    userTwo = userTwoDoc.user
    tokenTwo = userTwoDoc.token


    contactThree = await Contact.create({...contactThree , user: userOne._id}) 
    
})
describe('Create Contact', () => {
    test('Autenticated user can create contact',async () => {
        const response = await request(app)
            .post(baseUrl + `/${userOne.id}/contacts`)
            .set({'authorization':`Bearer ${tokenOne}`})
            .send(contactOneData)
            .expect(200)
        const contact = response.body.contact
        expect(contact.user).toBe(userOne._id.toString())
    })
    test('Unautenticated user cannot create contact',async () => {
        const response = await request(app)
            .post(baseUrl + `/${userOne.id}/contacts`)
            .send(contactOneData)
            .expect(401)
    })
})

describe('Update and delete contact', () => {

    test('Autenticated user cannot update contact that is her own',async () => {
        
        const response = await request(app)
            .patch(baseUrl + `/${contactThree._id}`)
            .set({'authorization':`Bearer ${tokenTwo}`})
            .send(contactOneData)
            .expect(403)
        console.log(response.body)

    })
})